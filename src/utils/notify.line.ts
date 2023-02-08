import { stringify } from "querystring";
import { env } from "@/env/server.mjs";

export const LineNotification = (message: string) => {
  fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.LINE_API}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: stringify({ message }),
  }).catch((err) => console.error(err));
};
