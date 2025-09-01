import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { Types } from 'mongoose';

interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async({ email, emailType, userId }: SendEmailParams) => {
  try {

    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    const objectId = new Types.ObjectId(userId);

    if( emailType === "VERIFY"){
      await User.findOneAndUpdate(objectId, {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000} )
    } else if( emailType ===  "RESET"){
      await User.findByIdAndUpdate(objectId, {forgetPasswordToken: hashedToken, forgetpasswordTokenExpiry : Date.now() + 3600000});
    }

    const transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  }});

    const mailOption = {
    from: 'noorain@noorain.ai',
    to: email,
    subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
     html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
  }

    const mailResopnse = await transport.sendMail(mailOption);
    return mailResopnse;


  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
