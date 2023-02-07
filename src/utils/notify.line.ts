import { stringify } from "querystring";
import { env } from "@/env/server.mjs";
import { Contact } from "@prisma/client";

export const LineNotification = (data: Contact) => {
  fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.LINE_API}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: stringify({
      message: [
        "",
        "問い合わせがありました",
        `[Email]`,
        `${data.replyEmail}`,
        `[subject]`,
        `${data.subject}`,
        `[body]`,
        `${data.body}`,
      ].join("\n"),
    }),
  }).catch((err) => console.error(err));
};
