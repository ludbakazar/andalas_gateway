import TransactionModel from "@/config/db/models/transactionModel";
import errorHandler from "@/config/helpers/errorHandler";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const id = request.headers.get("userId");

    if (!id) {
      return Response.json("Missing userId header", { status: 400 });
    }

    const body = await request.json();

    const { totalAmount } = body;

    if (!totalAmount || typeof totalAmount !== "number") {
      return Response.json("Invalid input", { status: 400 });
    }

    const newTransaction = {
      userId: new ObjectId(id),
      totalAmount,
    };

    const transaction = await TransactionModel.create(newTransaction);

    const parameter = {
      transaction_details: {
        order_id: transaction.insertedId.toString(),
        gross_amount: totalAmount,
      },
    };

    const secret = process.env.SERVER_KEY_MIDTRANS;
    if (!secret) {
      return Response.json("Missing SERVER_KEY_MIDTRANS", { status: 500 });
    }
    const encodedSecret = Buffer.from(secret).toString("base64");

    const paymentUrl = await fetch(
      `${process.env.PUBCLIC_API_MIDTRANS}/v1/payment-links`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedSecret}`,
        },
        body: JSON.stringify(parameter),
      }
    );
    const paymentData = await paymentUrl.json();

    return Response.json({
      paymentUrl: paymentData.payment_url,
    });
  } catch (error) {
    return errorHandler(error);
  }
}
