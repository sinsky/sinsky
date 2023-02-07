import { createTRPCRouter, publicProcedure } from "../trpc";
import { createContactSchema, getContactSchema } from "@/schema/contact";

export const contactRouter = createTRPCRouter({
  create: publicProcedure
    .input(createContactSchema)
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.contact.create({ data: { ...input } })
    ),
  getContact: publicProcedure.input(getContactSchema).query(
    async ({ ctx, input }) =>
      await ctx.prisma.contact.findUnique({
        where: {
          id: input.cuid,
        },
      })
  ),
});
