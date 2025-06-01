import TransactionModel from "@/config/db/models/transactionModel";
import errorHandler from "@/config/helpers/errorHandler";
import { tr } from "zod/v4/locales";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id } = body;
    const transactionId = order_id.split("-")[0];

    await TransactionModel.updateStatus(transactionId);

    return Response.json("ok transactions", { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
