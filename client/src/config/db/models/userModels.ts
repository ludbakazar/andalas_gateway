import { z } from "zod";
import { database } from "../config/config";
import { newUser } from "@/type";
import { hashPass } from "@/config/helpers/bcrypt";

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
}

export default UserModel;
