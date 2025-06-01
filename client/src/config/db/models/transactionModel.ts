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

  static async updateStatus(transactionId: string) {
    if (!ObjectId.isValid(transactionId)) {
      throw new Error("Invalid transactionId format");
    }
    const id = new ObjectId(transactionId);

    return await this.collection().updateOne(
      {
        _id: id,
      },
      {
        $set: {
          status: "success",
          updatedAt: new Date(),
        },
      }
    );
  }
}

export default TransactionModel;
