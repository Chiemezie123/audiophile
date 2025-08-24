import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

// 1️⃣ Interface for User document properties
export interface IUser {
  name: string;
  email: string;
  role: "user" | "admin";
  password: string ;
  confirmPassword?: string;
  resetTokenProperty?: string;
  resetTokenExpiresIn?: Date;
  photo?: string;
  createdPasswordAt?: Date;
  isDeleted: boolean;
}

// 2️⃣ Interface for instance methods
export interface IUserMethods {
  correctPassword(
    loginPassword: string,
    dataBasePassword: string
  ): Promise<boolean>;
  changedPasswordAfter(jwtTimeStamp: number): boolean;
  createNewTokenAndRetrieveToken(): string;
}

// 3️⃣ Combine document + methods for model typing
export type UserDocument = Document & IUser & IUserMethods;

// 4️⃣ Define schema
const userSchema = new mongoose.Schema<UserDocument>({
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
    validate: [validator.isEmail, "must have an email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Password must correlate"],
    validate: {
      validator: function (this: UserDocument, el: string): boolean {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
    select: false,
  },
  resetTokenProperty: String,
  resetTokenExpiresIn: Date,
  photo: {
    type: String,
    default: "default.jpg",
  },
  createdPasswordAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// 5️⃣ Document middleware
userSchema.pre<UserDocument>("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.createdPasswordAt = new Date(Date.now() - 1000);
  next();
});

userSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// 6️⃣ Query middleware
userSchema.pre<UserDocument>(/^find/, function (next) {
  this.find({ isDeleted: false });
  next();
});

// 7️⃣ Instance methods
userSchema.methods.correctPassword = async function (
  loginPassword: string,
  dataBasePassword: string
) {
  return await bcrypt.compare(loginPassword, dataBasePassword);
};





userSchema.methods.changedPasswordAfter = function (jwtTimeStamp: number) {
  if (this.createdPasswordAt) {
    const getMainTimeStamp = Math.floor(this.createdPasswordAt.getTime() / 1000);
    return jwtTimeStamp < getMainTimeStamp;
  }
  return false;
};


userSchema.methods.createNewTokenAndRetrieveToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetTokenProperty = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetTokenExpiresIn = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

// 8️⃣ Model export
const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  userSchema
);

export default User;
