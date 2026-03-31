import jwt from "jsonwebtoken";
import { UserDocument } from "../models/userModel.js";
import { Response } from "express";
import { ENV } from "../config/env.js";

export const getToken = (id: string | unknown) => {
  return jwt.sign({ id }, ENV.JWT_SECRET_KEY, {
    expiresIn: ENV.JWT_EXPIRE_TIME,
  });
};

export const sendTokenGenerated = (
  user: UserDocument,
  statusCode: number,
  res: Response,
  status?: string,
) => {
  const token = getToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIES_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  console.log(token, 'token is here')
  res.cookie("jwt", token, {
    // httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "none",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // Convert Mongoose doc to plain object and remove password
  const { password, ...safeUser } = user.toObject();

  res.status(statusCode).json({
    status: status,
    user: safeUser,
    token,
  });
};
