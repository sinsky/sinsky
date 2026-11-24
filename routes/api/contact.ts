import { defineHandler } from "void";
import { env } from "void/env";
import { contactSchema } from "@/lib/contactSchema";
import { submitContact } from "@/lib/contactSubmit";

type ContactPayload = {
  name: unknown;
  email: unknown;
  message: unknown;
  "bot-field"?: unknown;
};

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
} as const;

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export const POST = defineHandler(async (c) => {
  const contentType = c.req.header("content-type") ?? "";
  let payload: ContactPayload;
  try {
    if (contentType.includes("application/json")) {
      payload = (await c.req.json()) as ContactPayload;
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      payload = (await c.req.parseBody({ all: true })) as ContactPayload;
    } else {
      return json(415, { error: "unsupported media type" });
    }
  } catch {
    return json(400, { error: "invalid request body" });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return json(422, {
      error: parsed.error.issues[0]?.message ?? "validation error",
    });
  }

  const result = await submitContact(parsed.data, env.SLACK_WEBHOOK_URL);
  if (!result.ok) {
    return json(result.status, { error: result.message });
  }

  return json(200, { ok: true });
});
