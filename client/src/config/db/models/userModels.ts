import { z } from "zod";
import { database } from "../config/config";
import { newUser } from "@/type";
import { hashPass } from "@/config/helpers/bcrypt";
import { ObjectId } from "mongodb";

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
});

class UserModel {
  static collection() {
    return database.collection("users");
  }

  static async create(userData: newUser) {
    userSchema.parse(userData);

    const existingUser = await this.collection().findOne({
      email: userData.email,
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newUser = {
      name: userData.name,
      kode: userData.kode,
      email: userData.email,
      role: "user",
      username: userData.username,
      password: hashPass(userData.password),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.collection().insertOne(newUser);
  }

  static async findByUsername(username: string) {
    return await this.collection().findOne({ username });
  }

  static async findById(id: string) {
    return await this.collection().findOne({ _id: new ObjectId(id) });
  }
}

export default UserModel;
