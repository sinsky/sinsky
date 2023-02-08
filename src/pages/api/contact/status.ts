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
    if (data) {
      const message = [
        "",
        "問い合わせがありました",
        `[Email]`,
        `${data.replyEmail}`,
        `[subject]`,
        `${data.subject}`,
        `[body]`,
        `${data.body}`,
      ].join("\n");
      LineNotification(message);
    } else {
      LineNotification(
        "\n問い合わせがありましたが、データが取得できませんでした"
      );
    }
  } else {
    res.status(200).send({ status: false });
  }
};

export default handler;
