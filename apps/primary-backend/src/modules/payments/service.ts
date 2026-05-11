import { prisma } from "db";

const ONRAMP_CREDITS = 1000;

export abstract class PaymentsService {
  /** Dev placeholder: grants a fixed credit bundle until Razorpay is wired. */
  static async onrampCredits(userId: number): Promise<{ credits: number }> {
    const result = await prisma.$transaction(async (tx) => {
      await tx.onrampTransaction.create({
        data: {
          userId,
          amount: ONRAMP_CREDITS,
          status: "completed",
        },
      });

      const user = await tx.user.update({
        where: { id: userId },
        data: { credits: { increment: ONRAMP_CREDITS } },
      });

      return { credits: user.credits };
    });

    return result;
  }
}
