import UserModel from "@/config/db/models/userModels";
import { comparePass } from "@/config/helpers/bcrypt";
import errorHandler from "@/config/helpers/errorHandler";
import { signToken } from "@/config/helpers/jwt";
import { loginUser, userType } from "@/type";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const userData: loginUser = await request.json();
    const { username, password } = userData;

    if (!username || !password) {
      return Response.json(
        {
          message: "Username and password are required",
        },
        {
          status: 400,
        }
      );
    }

    const user = await UserModel.findByUsername(username);

    if (!user) {
      return Response.json(
        {
          message: "invalid username or password",
        },
        {
          status: 401,
        }
      );
    }

    const isPasswordValid = comparePass(password, user.password);

    if (!isPasswordValid) {
      return Response.json(
        {
          message: "invalid username or password",
        },
        {
          status: 401,
        }
      );
    }

    const access_token = signToken({
      _id: user._id.toString(),
      username: user.username,
    });

    const cookiesStore = await cookies();
    cookiesStore.set("authorization", `Bearer ${access_token}`);
    return Response.json(
      {
        message: "Login successful",
        access_token,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return errorHandler(error);
  }
}
