import  jwt, { JwtPayload }  from "jsonwebtoken";
import { NextRequest } from "next/server";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export async function getDataFromToken(request:NextRequest) {
  try {
        const token = request.cookies.get("token")?.value || '';
        const decodedToken= jwt.verify(token, process.env.TOKEN_SECRET!) as CustomJwtPayload ;
        return decodedToken.id;
    }  catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}