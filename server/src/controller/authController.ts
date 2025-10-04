import User from "../models/userModel.js";
import { catchAsync } from "../errrorHandling/error.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { AllError } from "../errrorHandling/error.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Email from "../utils/emailHandler.js";
import { sendEmail, sendEmailForOtp } from "../utils/emailHandler.js";
import { sendTokenGenerated } from "../utils/JwtUtils.js";
import express from "express";
import passport from "passport";
import GoogleStrategy from "passport-google-oidc";
import { NextFunction, Request, Response } from "express";
import Otp from "../models/otpModal.js";

export const requestOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;


    if(email){
      const user = await Otp.findOne({ email });
      if(user){
        await Otp.deleteMany({ email }); // cleanup
      }
    }

    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
    });

    const newEmail = new sendEmailForOtp(email, otp);
    await newEmail.sendOtp();

    res.json({ success: true, message: "OTP sent to your email" });
  }
);

export const verifyOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ error: "OTP not found" });

    const isValid = await bcrypt.compare(otp, record.otp);
    console.log(isValid, "isValid");
    if (!isValid || record.expiresAt < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await Otp.deleteMany({ email }); // cleanup
    res.json({ success: true, message: "OTP verified" });
  }
);

export const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, confirmPassword } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
      });
    } else {
      user.password = hashedPassword;
      user.confirmPassword = hashedPassword;
      await user.save();
    }

    sendTokenGenerated(user, 201, res, "user created");
   
  }
);

export const completeProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, dob } = req.body;

    const user = await User.findById(req.user.id);
    user.firstName = firstName;
    user.lastName = lastName;
    user.dateOfBirth = dob;
    await user.save();

    sendTokenGenerated(user, 201, res);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      const message = new AllError(`must input email and password`, 400);
      next(message);
    }

    const user = await User.findOne({ email }).select("+password");
    console.log(user, "user is the what i am looking for");

    if (user === null)
      return next(
        new AllError("user doesnt exist ,please check email and password ")
      );

    const isPassword = await user.correctPassword(password, user.password);
    console.log(isPassword, "is this true");
    if (!user.email || !isPassword) {
      const message = new AllError(`incorrect password or email`, 401);
      return next(message);
    }

    if (user) {
      sendTokenGenerated(user, 200, res);
    }
  }
);

export const logOut = (req: Request, res: Response, next: NextFunction) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };

  res.cookie("jwt", "noMOreJwtToken", cookieOptions);

  res.status(200).json({
    status: "success",
    message: "successfully, user logged out",
  });
};

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      console.log(token, "hit breathing");
      token = req.headers.authorization.split(" ")[1];
    } else {
      token = req.cookies.jwt;
    }
    // console.log(req.headers.authorization, 'what is token')
    if (!token) {
      const message = new AllError(`user is not logged in`, 401);
      return next(message);
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
      id: string;
      iat: number;
    };
    // console.log(decode, 'ohhhhh')
    // if user still exist
    const freshUser = await User.findById(decode.id);
    // console.log(freshUser,'freshUser')
    if (!freshUser) {
      const message = new AllError(
        `the user who had this token no longer exist`,
        401
      );
      return next(message);
    }

    //check if user changed password after token was issued
    if (freshUser.changedPasswordAfter(decode.iat)) {
      // const message = ;
      // console.log(message,'from here')
      return next(
        new AllError(
          `Password has been changed, fuzzy please log in again`,
          401
        )
      );
    }

    req.user = freshUser;

    next();
  }
);

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.cookies.jwt; // Use req.cookies, not res.cookies
    console.log(token, "diana");
    if (!token) {
      return next(); // No token means user is not logged in, proceed without attaching a user
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
      id: string;
      iat: number;
    };

    // Find the user based on the token's payload
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(); // User no longer exists, proceed without attaching a user
    }

    // Check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return next(); // Password changed, token is no longer valid
    }

    // Attach user to the request object
    res.locals.user = freshUser;
    return next(); // User is logged in
  } catch (err) {
    res.locals.user = null;
    return next();
  }
};

export const restriction = (...roles) => {
  return (req, res, next) => {
    //['admin', 'lead-guide] role = 'user'
    if (!roles.includes(req.user.role)) {
      //   console.log(req.user.role, 'make i sure');
      const message = new AllError(
        `you are trying to access an authorized page`,
        403
      );
      return next(message);
    }

    next();
  };
};

export const forgotPasswords = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const message = new AllError(
        `fuck out! , this user doesn't exist in my database`,
        403
      );
      return next(message);
    }

    const resetToken = user.createNewTokenAndRetrieveToken();
    await user.save({ validateBeforeSave: false });

    const resetURl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/${resetToken}`;

    const message = `if you forgot your password, please on this url : ${resetURl} to get a new, or ignore if you dont need a new password`;

    try {
      const email = new sendEmail(user, resetURl);

      await email.send(
        "passwordReset",
        "Please reset your password in 10 minutes"
      );

      res.status(200).json({
        message: "success",
        secondMessage: "token sent to email",
      });
    } catch (err) {
      user.resetTokenProperty = undefined;
      user.resetTokenExpiresIn = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AllError("password reset failed, please try again later", 500)
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get user based on token
    // if token has expired, and there is user, set the new password
    // update changePasswordAt property for the user
    // login user in , send jwt
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    //   console.log(hashedToken, 'from here');
    const user = await User.findOne({
      resetTokenProperty: hashedToken,
      resetTokenExpiresIn: { $gt: Date.now() },
    });
    console.log(user, "this is user");
    if (!user) {
      const message = `token is invalid or has expired`;

      const errorMessage = new AllError(message, 500);
      return next(errorMessage);
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.resetTokenProperty = undefined;
    user.resetTokenExpiresIn = undefined;
    await user.save();

    const jwTtoken = getToken(user._id);

    res.status(200).json({
      message: "success",
      token: jwTtoken,
    });
  }
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get user from the collection
    // check if the posted passwords is correct
    // update the password
    // log the user in, with the new password that was just update
    let jwTtoken;
    const { id } = req.user;
    const user = await User.findById(id).select("+password");
    // console.log(user, 'chai');
    // const isConfirmPassword = comparePassword(password, user.confirmPassword)
    if (!user) {
      const message = new AllError(
        `no user with this details, is our database`,
        400
      );
      return next(message);
    }
    console.log(req.body.password, "here");
    const isPassword = await user.correctPassword(
      req.body.password,
      user.password
    );
    if (isPassword) {
      user.password = req.body.updatePassword;
      user.confirmPassword = req.body.updatePassword;
      await user.save();
      jwTtoken = getToken(user._id);

      res.cookie("jwt", jwTtoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
    } else {
      const message = new AllError(`fuck men , this password is wrong`, 401);
      return next(message);
    }
    // user.findIDandUpdate would not work,so the middle 'pre' for saving changes to the db would not be called
    // this is because when use findbyidandupdate, this doesnt save the previous schema object in memories, and doesnt also used the
    // the middleware to encrpt and update create for password,
    res.status(200).json({
      message: "success",
      token: jwTtoken,
    });
  }
);

// Google OAuth routes
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // This will be called after Google redirects back
    passport.authenticate(
      "google",
      { session: false },
      (err: any, user: any) => {
        if (err) {
          console.error("OAuth error:", err);
          return res.redirect(
            `${
              process.env.CLIENT_URL || "http://localhost:3000"
            }/signup?error=oauth_error`
          );
        }

        if (!user) {
          return res.redirect(
            `${
              process.env.CLIENT_URL || "http://localhost:3000"
            }/signup?error=oauth_failed`
          );
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY!, {
          expiresIn: process.env.JWT_EXPIRE_TIME || "90d",
        });

        // Set JWT as httpOnly cookie
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        // Create user data to pass to frontend (without sensitive info)
        const userData = {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          photo: user.photo,
          authProvider: user.authProvider,
          isEmailVerified: user.isEmailVerified,
          role: user.role,
        };

        // Encode user data to pass via URL
        const encodedUserData = encodeURIComponent(JSON.stringify(userData));

        // Redirect to landing page with user data
        res.redirect(
          `${
            process.env.CLIENT_URL || "http://localhost:3000"
          }?auth=success&user=${encodedUserData}`
        );
      }
    )(req, res, next);
  }
);

// Check if user exists (for OAuth flow)
export const checkUserExists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    res.status(200).json({
      status: "success",
      exists: !!user,
      authProvider: user?.authProvider || null,
    });
  }
);
