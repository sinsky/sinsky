import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import { LineNotification } from "@/utils/notify.line";

type Response =
  | { status: true; cuid: string }
  | {
      status: false;
    };

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const cuid = req.query.cuid;
  if (cuid) {
    const id = Array.isArray(cuid) ? cuid.flat(Infinity).join("") : cuid;
    res.status(200).send({ status: true, cuid: id });
    const caller = appRouter.createCaller({
      prisma,
    });
    const data = await caller.contact.getContact({ cuid: id });
    if (data) LineNotification(data);
  } else {
    res.status(200).send({ status: false });
  }
};

export default handler;
