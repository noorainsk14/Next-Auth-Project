import { connectDB } from "@/dbConfig/dbConfig";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

connectDB();

export async function POST(request:NextRequest) {
  try {
    const reqBody = await request.json();
    const {username, email, password} = reqBody;

   console.log(reqBody);
    
   const user = await User.findOne({email});

   //check if user exist
   if(user) {
      return NextResponse.json({error: "User already exist"}, {status: 400});
   }
   
   //hashed password
   const salt = await bcryptjs.genSalt(10);
   const hashedPassword = await bcryptjs.hash(password, salt);

   const newUser = new User({
    username,
    email,
    password: hashedPassword
   })

   const savedUser = await newUser.save();  
   console.log(savedUser);

   //send email verification

   await sendEmail({email, emailType: "VERIFY", userId: savedUser._id});

   return NextResponse.json({
    message:"User creeated successfully",
    success: true,
    savedUser
   });
   

  } 
  catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({error: error.message}, {status: 500})
     } else {
      throw new Error("An unexpected error occurred");
    }
  }
}
