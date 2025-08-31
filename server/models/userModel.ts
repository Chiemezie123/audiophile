import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

// User interface for methods
interface IUser extends Document {
  name: string;
  email: string;
  role: "user" | "admin";
  password: string;
  confirmPassword?: string;
  photo: string;
  createdPasswordAt: Date;
  isDeleted: boolean;
  resetTokenProperty?: string;
  resetTokenExpiresIn?: Date;
  correctPassword(
    loginPassword: string,
    dataBasePassword: string
  ): Promise<boolean>;
  changedPasswordAfter(jwtTimeStamp: number): boolean;
  createNewTokenAndRetrieveToken(): string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "A user must have an email"],
    validate: [validator.isEmail, "must have an email yh yh yh"],
  },

  role: {
    type: String,
    enum: ["user",  "admin"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "A user must have a password"],
    select: false,
  },

  confirmPassword: {
    type: String,
    required: [true, "password must correlate"],
    validate: {
      validator: function (this: any, el: string) {
        return el === this.password;
      },
      message: "password are not the same",
    },
    select: false,
  },
  resetTokenProperty: {
    type: String,
  },
  resetTokenExpiresIn: {
    type: Date,
  },
  photo: {
    type: String,
    default: "default.jpg",
    required: [false, "must include a profile picture"],
  },

  createdPasswordAt: {
    type: Date,
    default: Date.now(),
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// document middleware
userSchema.pre("save", function (this: any, next: any) {
  if (!this.isModified("password") || this.isNew) return next();

  this.createdPasswordAt = Date.now() - 1000;
  next();
});

userSchema.pre("save", async function (this: any, next: any) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// query middleware
userSchema.pre(/^find/, function (this: any, next: any) {
  this.find({ isDeleted: false });
  next();
});

userSchema.methods.correctPassword = async function (
  loginPassword: string,
  dataBasePassword: string
) {
  return await bcrypt.compare(loginPassword, dataBasePassword);
};

userSchema.methods.changedPasswordAfter = function (
  this: any,
  jwtTimeStamp: number
) {
  const getMainTimeStamp = parseInt(
    (this.createdPasswordAt.getTime() / 1000).toString(),
    10
  );
  if (this.createdPasswordAt) {
    console.log(getMainTimeStamp, jwtTimeStamp, "pena colastS");
    return jwtTimeStamp < getMainTimeStamp;
  }
  return false;
};

userSchema.methods.createNewTokenAndRetrieveToken = function (this: any) {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetTokenProperty = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetTokenExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
