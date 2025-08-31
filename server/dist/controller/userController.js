var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AllError, catchAsync } from "../Errors/errorUtils.js";
import User from "../models/userModel.js";
import path from "path";
import multer from "multer";
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "src/public/img/users"));
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    },
});
// USING MEMORYSTORAGE MEANS YOU YOU WANT THE IMAGE NOT TO BE SAVED A DEST BUT TO BE SAVED IN MEMORY FIRST
// THEN U CAN THEN PROCESS THE IMAGE BEFORE SAVED IT TO FILE AND SAVING THE FILENAME TO THE DB
// const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image"))
        return cb(null, true);
    if (!file.mimetype.startsWith("image"))
        return cb(new AllError("file type must be an image", 400), false);
};
const upload = multer({
    storage: Storage,
    fileFilter: multerFilter,
});
export const userUploadImage = upload.single("photo");
// THE BELOW IS AN IMAGE PROCESSOR MIDDLEWARE , THAT IS USED TO RESIZE THE IMAGE,AN STORE IT TO A PARTICULAR DIRECTORY
// SHARP IS NPM PACKAGE USED TO HANDLE IMAGE PROCESSING, IT ASYNCHRONOUS, SO IT RETURN A PROMISE, SO THE
// RESIZE MIDDLEWARE ARE TO ASYNC FUNCTION
// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();
//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/${req.file.filename}`);
//   next();
// });
const bodyFunc = (body, ...elements) => {
    let newObj = {};
    Object.keys(body).forEach((el) => {
        newObj[el] = body[el];
    });
    return newObj;
};
export const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
export const updateMe = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // create error if you user post password
    //update user document
    console.log(req.file, "whats in the file");
    if (req.file && req.file.filename) {
        req.body.photo = req.file.filename;
    }
    console.log(req.file, "SHOW MEEEEE WEY PHOTO");
    // console.log(path.join(__dirname, '../public/img/users'), 'the PATH');
    if (req.body.password) {
        const message = new AllError(`u can't update password here, used update password route`, 400);
        return next(message);
    }
    const selectedBody = bodyFunc(req.body, "email", "name", "photo");
    console.log(selectedBody, "selectedbody");
    const updatedUser = yield User.findByIdAndUpdate(req.user.id, selectedBody, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        message: "success",
        user: updatedUser,
    });
}));
export const deleteMe = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    if (!id)
        return next(new AllError(`you don't have access , please login to get access`, 400));
    const deletedUser = yield User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedUser) {
        // console.log('No tour found with that ID');
        return next(new AllError(`No tour found with that ID`, 400));
    }
    res.status(200).json({
        message: "success!,  user detail removed ",
        deletedUser,
    });
}));
export const updateExistingDocuments = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const getResult = yield User.updateMany({ isDeleted: { $exists: false } }, // Only update documents where isDeleted is missing
    { $set: { isDeleted: false } } // Set isDeleted to false
    );
    if (!getResult)
        return next(new AllError(`didnt work for some reason`, 400));
    res.status(200).json({
        message: "success",
        data: getResult,
    });
}));
// Call the function
// exports.getAllUsers = async(req, res, next) =>{
//     const allUsers = await User.find();
//     res.status(200).json({
//         message: "success",
//         allUsers
//     })
// };
// TODO: Implement factory functions or create direct implementations
export const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.find();
    res.status(200).json({
        status: "success",
        results: users.length,
        data: { users },
    });
});
export const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!user)
        return next(new AllError("No user found with that ID", 404));
    res.status(200).json({
        status: "success",
        data: { user },
    });
});
export const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findByIdAndDelete(req.params.id);
    if (!user)
        return next(new AllError("No user found with that ID", 404));
    res.status(204).json({
        status: "success",
        data: null,
    });
});
export const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findById(req.params.id);
    if (!user)
        return next(new AllError("No user found with that ID", 404));
    res.status(200).json({
        status: "success",
        data: { user },
    });
});
