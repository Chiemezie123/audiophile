import express from "express";
import * as userController from "../controller/userController.js";
import * as authController from "../controller/authController.js";

const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  updateMe,
  deleteMe,
  deleteUser,
  getMe,
  updateExistingDocuments,
  userUploadImage,
} = userController;

const {
  signUp,
  logIn,
  forgotPasswords,
  resetPassword,
  updatePassword,
  protect,
  restriction,
  logOut,
} = authController;

router.post("/signup", signUp);

router.post("/login", logIn);

router.get("/logout", logOut);

router.patch("/resetPassword/:token", resetPassword);

router.post("/forgotPassword", forgotPasswords);

router.patch("/updateDeleteField", updateExistingDocuments);
// using the protect middleware from his junction
router.use(protect);

router.patch("/updatePassword", updatePassword);

router.patch("/updateMe", restriction("user"), userUploadImage, updateMe);

router.delete("/deleteMe", restriction("user"), deleteMe);

router.get("/getMe", getMe, getUser);

router.route("/").get(restriction("admin", "lead-guide"), getAllUsers);

router
  .route("/:id")
  .get(restriction("admin"), getUser)
  .patch(restriction("admin"), updateUser)
  .delete(restriction("admin"), deleteUser);

export default router;
