// @vitest-environment node
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { submitContact } from "@/lib/contactSubmit";

const SLACK_URL =
  "https://hooks.slack.com/services/T0000000/B0000000/XXXXXXXXXXXXXXXXXXXXXXXX";

const valid = {
  "bot-field": "",
  name: "sinsky",
  email: "sin@example.com",
  message: "Hello, this is a contact form test.",
};

const server = setupServer();
let slackCalls = 0;
let capturedBody = "";

function mockSlack(status: number): void {
  server.use(
    http.post(SLACK_URL, async ({ request }) => {
      slackCalls += 1;
      capturedBody = await request.text();
      return new HttpResponse("ok", { status });
    }),
  );
}

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  slackCalls = 0;
  capturedBody = "";
});

afterAll(() => {
  server.close();
});

describe("submitContact", () => {
  it("rejects a honeypot submission without notifying slack", async () => {
    mockSlack(200);
    const result = await submitContact(
      { ...valid, "bot-field": "spam" },
      SLACK_URL,
    );
    expect(result).toEqual({ ok: false, status: 422, message: "bot detected" });
    expect(slackCalls).toBe(0);
  });

  it("sends escaped content to slack and returns ok", async () => {
    mockSlack(200);

    const result = await submitContact(
      {
        ...valid,
        name: "sinsky <test>",
        message: "hello <world> & friends",
      },
      SLACK_URL,
    );

    expect(result).toEqual({ ok: true });

    const payload = JSON.parse(capturedBody) as {
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

  it("returns 502-equivalent failure when slack rejects the webhook call", async () => {
    mockSlack(500);
    const result = await submitContact(valid, SLACK_URL);
    expect(result).toEqual({
      ok: false,
      status: 502,
      message: "failed to notify slack",
    });
  });

  it("returns 500-equivalent failure when the webhook is not configured", async () => {
    mockSlack(200);
    const result = await submitContact(valid, undefined);
    expect(result).toEqual({
      ok: false,
      status: 500,
      message: "server is not configured",
    });
    expect(slackCalls).toBe(0);
  });
});
