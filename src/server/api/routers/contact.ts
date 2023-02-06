import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { createContactSchema } from "@/schema/contact";

export const contactRouter = createTRPCRouter({
  create: publicProcedure
    .input(createContactSchema)
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.contact.create({ data: { ...input } })
    ),
});
