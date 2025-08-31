import mongoose from "mongoose";

const usreSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Please provide username'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Please providea password'],
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    forgetPasswordToken:String,
    forgetpasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date

})

const User = mongoose.models.user || mongoose.model("users", usreSchema);

export default User;