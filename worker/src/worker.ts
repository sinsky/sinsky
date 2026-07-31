type ContactPayload = {
  name: unknown;
  email: unknown;
  message: unknown;
  "form-name"?: unknown;
  "bot-field"?: unknown;
};

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
} as const;

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function validate(payload: ContactPayload): {
  ok: boolean;
  error?: string;
  data?: { name: string; email: string; message: string };
} {
  if (isString(payload["bot-field"]) && payload["bot-field"].length > 0) {
    return { ok: false, error: "bot detected" };
  }
  const name = payload.name;
  const email = payload.email;
  const message = payload.message;
  if (!isString(name) || name.trim().length === 0 || name.length > 100) {
    return { ok: false, error: "invalid name" };
  }
  if (
    !isString(email) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254
  ) {
    return { ok: false, error: "invalid email" };
  }
  if (
    !isString(message) ||
    message.trim().length < 10 ||
    message.length > 5000
  ) {
    return { ok: false, error: "invalid message" };
  }
  return { ok: true, data: { name, email, message } };
}

function escapeSlack(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildSlackPayload(data: {
  name: string;
  email: string;
  message: string;
}): Record<string, unknown> {
  return {
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "New contact form submission" },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Name*\n${escapeSlack(data.name)}` },
          { type: "mrkdwn", text: `*Email*\n${escapeSlack(data.email)}` },
        ],
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: escapeSlack(data.message) },
      },
    ],
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== "/api/contact" || request.method !== "POST") {
      return json(404, { error: "not found" });
    }

    const contentType = request.headers.get("content-type") ?? "";
    let payload: ContactPayload;
    try {
      if (contentType.includes("application/json")) {
        payload = (await request.json()) as ContactPayload;
      } else if (
        contentType.includes("application/x-www-form-urlencoded") ||
        contentType.includes("multipart/form-data")
      ) {
        const form = await request.formData();
        payload = Object.fromEntries(form.entries()) as ContactPayload;
      } else {
        return json(415, { error: "unsupported media type" });
      }
    } catch {
      return json(400, { error: "invalid request body" });
    }

    const result = validate(payload);
    if (!result.ok || !result.data) {
      return json(422, { error: result.error ?? "validation error" });
    }

    if (!env.SLACK_WEBHOOK_URL) {
      console.error("SLACK_WEBHOOK_URL is not configured");
      return json(500, { error: "server is not configured" });
    }

    const slackResponse = await fetch(env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildSlackPayload(result.data)),
    });

    if (!slackResponse.ok) {
      console.error(
        JSON.stringify({
          message: "slack webhook failed",
          status: slackResponse.status,
        }),
      );
      return json(502, { error: "failed to notify slack" });
    }

    return json(200, { ok: true });
  },
} satisfies ExportedHandler<Env>;
