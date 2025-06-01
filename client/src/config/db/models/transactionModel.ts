import { tr } from "zod/v4/locales";
import { database } from "../config/config";
import { ObjectId } from "mongodb";

class TransactionModel {
  static collection() {
    return database.collection("transactions");
  }

  static async create(transaction: { userId: ObjectId; totalAmount: number }) {
    const newTransaction = {
      userId: transaction.userId,
      totalAmount: transaction.totalAmount,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.collection().insertOne(newTransaction);
  }

  static async updateStatus(dataUpdate: {
    transactionId: string;
    order_id: string;
  }) {
    if (!ObjectId.isValid(dataUpdate.transactionId)) {
      throw new Error("Invalid dataUpdate.transactionId)) { format");
    }
    const id = new ObjectId(dataUpdate.transactionId);

    return await this.collection().updateOne(
      {
        _id: id,
      },
      {
        $set: {
          status: "success",
          updatedAt: new Date(),
          order_id: dataUpdate.order_id,
        },
      }
    );
  }
}

export default TransactionModel;
