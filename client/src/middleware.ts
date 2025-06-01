import next from "next";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyTokenJose } from "./config/helpers/jwt";
import errorHandler from "./config/helpers/errorHandler";

export async function middleware(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const authorization = cookieStore.get("authorization")?.value;

    if (!authorization) {
      return NextResponse.json(
        {
          message: "invalid token",
        },
        {
          status: 401,
        }
      );
    }

    const token = authorization.split(" ")[1];
    const decode = await verifyTokenJose<{ _id: string; username: string }>(
      token
    );

    if (!decode) {
      return NextResponse.json(
        {
          message: "invalid token",
        },
        {
          status: 401,
        }
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("userId", decode._id);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    return errorHandler(error);
  }
}

export const config = {
  matcher: ["/api/transactions/:path*"],
};
