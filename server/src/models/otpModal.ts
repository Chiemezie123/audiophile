// models/Otp.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String, // store hashed OTP
  expiresAt: Date,
});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
