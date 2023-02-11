import type { NextApiRequest, NextApiResponse } from "next";
import { LineNotification } from "@/utils/notify.line";

const handler = (req: NextApiRequest, res: NextApiResponse<undefined>) => {
  if (req.method === "POST") {
  }
  res.status(200).send(undefined);
};

export default handler;
