import { Router } from "express";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";
import {
  bookmarkPost,
  commentOnPost,
  deletePost,
  getBookmarkedPosts,
  getPostById,
  getReels,
  imagePost,
  textPost,
  toggleLikeToAnPost,
  userPostFeed,
  videoPost,
} from "../controllers/post.controllers";

const router = Router();

router.route("/").get(auth, userPostFeed);
router.route("/reels").get(auth, getReels);
router.route("/text").post(auth, textPost);
router.route("/image").post(auth, upload.single("image"), imagePost);
router.route("/video").post(auth, upload.single("video"), videoPost);
router.route("/bookmark/:id").put(auth, bookmarkPost);
router.route("/bookmarks").get(auth, getBookmarkedPosts);
router
  .route("/:id")
  .delete(auth, deletePost)
  .get(auth, getPostById)
  .put(auth, toggleLikeToAnPost);

router.route("/comment/:id").post(auth, commentOnPost);

export default router;
