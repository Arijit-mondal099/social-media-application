import { Router } from "express";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";
import {
  bookmarkPost,
  deletePost,
  getBookmarkedPosts,
  imagePost,
  textPost,
  toggleLikeToAnPost,
  userPostFeed,
  videoPost,
} from "../controllers/post.controllers";

const router = Router();

router.route("/").get(auth, userPostFeed);
router.route("/text").post(auth, textPost);
router.route("/image").post(auth, upload.single("image"), imagePost);
router.route("/video").post(auth, upload.single("video"), videoPost);
router.route("/:id").delete(auth, deletePost);
router.route("/:id").put(auth, toggleLikeToAnPost);
router.route("/bookmark/:id").put(auth, bookmarkPost);
router.route("/bookmarks").get(auth, getBookmarkedPosts);

export default router;
