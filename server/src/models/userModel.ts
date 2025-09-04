import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

// 1️⃣ Interface for User document properties
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  password?: string; // Optional for OAuth users
  confirmPassword?: string;
  resetTokenProperty?: string;
  resetTokenExpiresIn?: Date;
  photo?: string;
  createdPasswordAt?: Date;
  isDeleted: boolean;
  dateOfBirth: Date;

  // OAuth fields
  authProvider: "local" | "google" | "facebook" | "instagram";
  googleId?: string;
  facebookId?: string;
  instagramId?: string;
  isEmailVerified: boolean;
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
  firstName: {
    type: String,
    required: [false, "A user must have a first name"],
    trim: true,
  },

  lastName: {
    type: String,
    required: [false, "A user must have a last name"],
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "A user must have an email"],
    validate: [validator.isEmail, "must have an email "],
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  dateOfBirth: {
     type: Date,
     required: [false, "A user must have a date of birth"],
  },
  password: {
    type: String,
    required: function (this: UserDocument) {
      // Password is required only for local auth users
      return this.authProvider === "local";
    },
    select: false,
  },
  confirmPassword: {
    type: String,
    required: function (this: UserDocument) {
      // confirmPassword is required only for local auth users
      return this.authProvider === "local";
    },
    validate: {
      validator: function (this: UserDocument, el: string): boolean {
        // Only validate if both password and confirmPassword exist
        if (!this.password || !el) return true;
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

  // OAuth fields
  authProvider: {
    type: String,
    enum: ["local", "google", "facebook", "instagram"],
    default: "local",
    required: true,
  },
  googleId: {
    type: String,
    sparse: true, // Allows multiple null values
  },
  facebookId: {
    type: String,
    sparse: true,
  },
  instagramId: {
    type: String,
    sparse: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: function (this: UserDocument) {
      // Auto-verify emails from OAuth providers
      return this.authProvider !== "local";
    },
  },
});

// 5️⃣ Document middleware
userSchema.pre<UserDocument>("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.createdPasswordAt = new Date(Date.now() - 1000);
  next();
});

userSchema.pre<UserDocument>("save", async function (next) {
  // Only hash password if it exists and is modified (for local auth users)
  if (!this.isModified("password") || !this.password) return next();
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
  // Only compare passwords for local auth users
  if (!dataBasePassword) return false;
  return await bcrypt.compare(loginPassword, dataBasePassword);
};

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp: number) {
  if (this.createdPasswordAt) {
    const getMainTimeStamp = Math.floor(
      this.createdPasswordAt.getTime() / 1000
    );
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

// 9️⃣ Cleanup old indexes when the model is loaded
User.collection.dropIndex("name_1").catch(() => {
  // Index might not exist, ignore error
});
User.collection.dropIndex("firstName_1").catch(() => {
  // Index might not exist, ignore error
});
User.collection.dropIndex("lastName_1").catch(() => {
  // Index might not exist, ignore error
});

export default User;
