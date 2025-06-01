import TransactionModel from "@/config/db/models/transactionModel";
import UserModel from "@/config/db/models/userModels";
import errorHandler from "@/config/helpers/errorHandler";
import { userType } from "@/type";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const id = request.headers.get("userId");
    if (!id || !ObjectId.isValid(id)) {
      return Response.json("Invalid or missing userId header", { status: 400 });
    }

    const userResult = await UserModel.findById(id);

    if (!userResult) {
      return Response.json("User not found", { status: 404 });
    }
    const user: userType = userResult as userType;

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
        order_id: `${user.kode}-${transaction.insertedId.toString()}`,
        gross_amount: totalAmount,
      },
    };

    console.log(parameter);

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
