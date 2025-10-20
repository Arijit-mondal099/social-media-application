import { Router } from "express";
import {
  changeEmail,
  changePassword,
  deleteUserAccount,
  getProfile,
  getUserPosts,
  login,
  register,
  savePost,
  updateProfileImage,
  updateProfileInfo,
} from "../controllers/user.controllers";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);

router.route("/").get(auth, getProfile);
router.route("/posts").get(auth, getUserPosts);
router.route("/save-posts").put(auth, savePost);
router.route("/updateprofile-info").put(auth, updateProfileInfo);
router.route("/updateprofile-image").put(auth, upload.single("image"), updateProfileImage);
router.route("/change-email").put(auth, changeEmail);
router.route("/change-password").put(auth, changePassword);
router.route("/delete-account").delete(auth, deleteUserAccount);

export default router;
