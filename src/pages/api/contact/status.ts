import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "@/server/api/root";
import { stringify } from "querystring";
import { env } from "@/env/server.mjs";
import { prisma } from "@/server/db";
import { LineNotification } from "@/utils/notify.line";

type TestRes = {
  status: boolean;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<TestRes>) => {
  const cuid = req.query.cuid;
  if (cuid) {
    res.status(200).send({ status: true });
    const id = Array.isArray(cuid) ? cuid.flat(Infinity).join("") : cuid;
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
