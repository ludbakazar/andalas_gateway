import UserModel from "@/config/db/models/userModels";
import errorHandler from "@/config/helpers/errorHandler";

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    await UserModel.create(userData);

    return Response.json("user created successfully", {
      status: 201,
    });
  } catch (error: any) {
    return errorHandler(error);
  }
}
