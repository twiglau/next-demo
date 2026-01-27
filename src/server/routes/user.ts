import { TRPCError } from "@trpc/server";
import { db } from "../db/db";
import { protectedProcedure, router } from "../trpc-middlewares/trpc";
import { Stripe } from "stripe";
import { orders } from "../db/schema";

export const usersRouter = router({
  getPlan: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });
    return user?.plan;
  }),
  upgrade: protectedProcedure.mutation(async ({ ctx }) => {
    const stripe = new Stripe("");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pro Plan",
            },
            unit_amount: 1900,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/pay/success",
      cancel_url: "http://localhost:3000/pay/cancel",
    });

    if (!session.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Stripe session URL not found",
      });
    }

    await db.insert(orders).values({
      sessionId: session.id,
      userId: ctx.session.user.id,
      status: "created",
    });

    return {
      url: session.url,
    };
  }),
});
