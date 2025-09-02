import { connectDB } from "@/dbConfig/dbConfig";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
  const { password, email } = reqBody;
  console.log(reqBody);

  //check if user exist
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User does not exiat" }, { status: 404 });
  }
  console.log(" user exist");

  //check if password is correct
  const validPassword = await bcryptjs.compare(password, user.password);
  if (!validPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }
  console.log(user);

  //create token data
  const tokenData = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  //create token

  const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
    expiresIn: "1d",
  });

  const response = NextResponse.json({
    message: "Login successful",
    success: true,
  });
  response.cookies.set("token", token, {
    httpOnly: true,
  });
  return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
  
}
