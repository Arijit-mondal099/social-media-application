import { Router } from "express";
import {
  getProfile,
  getUserPosts,
  login,
  register,
  savePost,
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
router
  .route("/updateprofile-image")
  .put(auth, upload.single("image"), updateProfileInfo);

export default router;
