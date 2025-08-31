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

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });

    const mailOption = {
    from: 'noorain@noorain.ai',
    to: email,
    subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
    html: "<b>Hello world?</b>", // HTML body
  }

    const mailResopnse = await transporter.sendMail(mailOption);
    return mailResopnse;


  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
