import type { ContactFormValues } from "./contactSchema";

export type SubmitResult =
  | { ok: true }
  | { ok: false; status: 422 | 500 | 502; message: string };

function escapeSlack(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildSlackPayload(data: ContactFormValues): Record<string, unknown> {
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

export async function submitContact(
  values: ContactFormValues,
  webhookUrl: string | undefined,
): Promise<SubmitResult> {
  if (values["bot-field"].length > 0) {
    return { ok: false, status: 422, message: "bot detected" };
  }

  if (!webhookUrl) {
    console.error("SLACK_WEBHOOK_URL is not configured");
    return { ok: false, status: 500, message: "server is not configured" };
  }

  let response: Response;
  try {
    response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildSlackPayload(values)),
    });
  } catch {
    // URLはログに含めない（シークレット保護）
    console.error(JSON.stringify({ message: "slack webhook request failed" }));
    return { ok: false, status: 502, message: "failed to notify slack" };
  }

  if (!response.ok) {
    console.error(
      JSON.stringify({
        message: "slack webhook failed",
        status: response.status,
      }),
    );
    return { ok: false, status: 502, message: "failed to notify slack" };
  }

  return { ok: true };
}
