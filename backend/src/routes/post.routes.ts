import { Router } from "express";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";
import { deletePost, imagePost, textPost, userPostFeed, videoPost } from "../controllers/post.controllers";

const router = Router();

router.route("/").get(auth, userPostFeed);
router.route("/text").post(auth, textPost);
router.route("/image").post(auth, upload.single("image"), imagePost);
router.route("/video").post(auth, upload.single("video"), videoPost);
router.route("/:id").delete(auth, deletePost);

export default router;
