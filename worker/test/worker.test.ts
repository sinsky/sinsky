import { env, fetchMock } from "cloudflare:test";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import worker from "../src/worker";

const SLACK_ORIGIN = "https://hooks.slack.com";
const SLACK_PATH = "/services/T0000000/B0000000/XXXXXXXXXXXXXXXXXXXXXXXX";

const validPayload = {
  name: "sinsky",
  email: "sin@example.com",
  message: "Hello, this is a contact form test.",
};

function jsonRequest(body: string, path = "/api/contact"): Request {
  return new Request(`https://sinsky.me${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

function formRequest(): Request {
  return new Request("https://sinsky.me/api/contact", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...validPayload, "bot-field": "" }).toString(),
  });
}

function mockSlack(status: number, captureBody?: (body: string) => void): void {
  fetchMock
    .get(SLACK_ORIGIN)
    .intercept({ method: "POST", path: SLACK_PATH })
    .reply(status, (options) => {
      captureBody?.(String(options.body));
      return "ok";
    });
}

function dispatch(request: Request, handlerEnv: Env = env): Promise<Response> {
  return worker.fetch(request, handlerEnv);
}

beforeAll(() => {
  fetchMock.activate();
  fetchMock.disableNetConnect();
});

afterEach(() => {
  fetchMock.assertNoPendingInterceptors();
});

describe("routing", () => {
  it("returns 404 for GET requests", async () => {
    const response = await dispatch(
      new Request("https://sinsky.me/api/contact"),
    );
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "not found" });
  });

  it("returns 404 for unknown paths", async () => {
    const response = await dispatch(jsonRequest("{}", "/api/other"));
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "not found" });
  });
});

describe("content negotiation", () => {
  it("returns 415 for unsupported media types", async () => {
    const response = await dispatch(
      new Request("https://sinsky.me/api/contact", {
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: "hello",
      }),
    );
    expect(response.status).toBe(415);
    expect(await response.json()).toEqual({
      error: "unsupported media type",
    });
  });

  it("returns 400 for malformed JSON bodies", async () => {
    const response = await dispatch(jsonRequest("{ not json"));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "invalid request body",
    });
  });
});

describe("validation", () => {
  it("rejects honeypot submissions", async () => {
    const response = await dispatch(
      jsonRequest(JSON.stringify({ ...validPayload, "bot-field": "spam" })),
    );
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({ error: "bot detected" });
  });

  it.each<[string, Record<string, unknown>, string]>([
    [
      "blank names",
      { name: "   ", email: validPayload.email, message: validPayload.message },
      "invalid name",
    ],
    [
      "invalid emails",
      {
        name: validPayload.name,
        email: "not-an-email",
        message: validPayload.message,
      },
      "invalid email",
    ],
    [
      "short messages",
      { name: validPayload.name, email: validPayload.email, message: "short" },
      "invalid message",
    ],
  ])("rejects %s", async (_label, payload, expectedError) => {
    const response = await dispatch(jsonRequest(JSON.stringify(payload)));
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({ error: expectedError });
  });
});

describe("slack notification", () => {
  it("sends escaped content to slack and returns 200", async () => {
    let slackBody = "";
    mockSlack(200, (body) => {
      slackBody = body;
    });

    const response = await dispatch(
      jsonRequest(
        JSON.stringify({
          name: "sinsky <test>",
          email: "sin@example.com",
          message: "hello <world> & friends",
        }),
      ),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    const payload = JSON.parse(slackBody) as {
      blocks: Array<{
        type: string;
        text?: { type: string; text: string };
        fields?: Array<{ type: string; text: string }>;
      }>;
    };
    expect(payload.blocks[0].text?.text).toBe("New contact form submission");
    expect(payload.blocks[1].fields?.[0].text).toBe(
      "*Name*\nsinsky &lt;test&gt;",
    );
    expect(payload.blocks[1].fields?.[1].text).toBe("*Email*\nsin@example.com");
    expect(payload.blocks[2].text?.text).toBe(
      "hello &lt;world&gt; &amp; friends",
    );
  });

  it("supports form-encoded submissions", async () => {
    mockSlack(200);
    const response = await dispatch(formRequest());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("returns 502 when slack rejects the webhook call", async () => {
    mockSlack(500);
    const response = await dispatch(jsonRequest(JSON.stringify(validPayload)));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "failed to notify slack" });
  });

  it("returns 500 when the slack webhook is not configured", async () => {
    const response = await dispatch(
      jsonRequest(JSON.stringify(validPayload)),
      {} as Env,
    );
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "server is not configured",
    });
  });
});
