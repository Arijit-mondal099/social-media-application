import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { Post } from "../models/post.model";
import { uploadFile } from "../utils/uploadToImagekit";
import mongoose from "mongoose";
import { User } from "../models/user.model";

/**
 * ROUTE: /api/v1/posts/text
 * METHOD: POST
 */
export const textPost = async (req: AuthRequest, res: Response) => {
  try {
    const { text, tags } = req.body;
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found!",
      });
    }

    if (!text?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Text is required" });
    }

    const post = await Post.create({
      postType: "text",
      text,
      createdBy: userId,
      tags,
    });

    user.posts.push(post._id as mongoose.Types.ObjectId);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: {
        ...post.toObject(),
        createdBy: {
          name: user.name,
          profileImage: user.profileImage,
          username: user.username,
        },
      },
    });
  } catch (error) {
    console.error("Text post error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

/**
 * ROUTE: /api/v1/posts/image
 * METHOD: POST
 */
export const imagePost = async (req: AuthRequest, res: Response) => {
  try {
    const { text, tags } = req.body;
    const userId = req.user?._id;
    const file = req.file;

    if (!text?.trim() || !file) {
      return res
        .status(400)
        .json({ success: false, message: "Text or file hasn't provided!" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found!",
      });
    }

    const result = await uploadFile(file, "/friends");

    if (!result.url) {
      return res.status(400).json({
        success: false,
        message: "File not uploaded please try again!",
      });
    }

    const post = await Post.create({
      postType: "image",
      text,
      image: result.url,
      createdBy: userId,
      tags,
    });

    user.posts.push(post._id as mongoose.Types.ObjectId);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Post created",
      post: {
        ...post.toObject(),
        createdBy: {
          name: user.name,
          profileImage: user.profileImage,
          username: user.username,
        },
      },
    });
  } catch (error) {
    console.error("Image post error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

/**
 * ROUTE: /api/v1/posts/video
 * METHOD: POST
 */
export const videoPost = async (req: AuthRequest, res: Response) => {
  try {
    const { text, tags } = req.body;
    const userId = req.user?._id;
    const file = req.file;

    if (!text?.trim() || !file) {
      return res
        .status(400)
        .json({ success: false, message: "Text or file hasn't provided!" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found!",
      });
    }

    const result = await uploadFile(file, "/friends");

    if (!result.url) {
      return res.status(400).json({
        success: false,
        message: "File not uploaded please try again!",
      });
    }

    const post = await Post.create({
      postType: "video",
      text,
      video: result.url,
      createdBy: userId,
      tags,
    });

    user.posts.push(post._id as mongoose.Types.ObjectId);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Post created",
      post: {
        ...post.toObject(),
        createdBy: {
          name: user.name,
          profileImage: user.profileImage,
          username: user.username,
        },
      },
    });
  } catch (error) {
    console.error("Video post error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

/**
 * ROUTE: /api/v1/posts/:id
 * METHOD: PUT
 */
export const toggleLikeToAnPost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const post = await Post.findById(id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found!" });
    }

    if (String(post.createdBy) === userId?.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You can't like to your own post!" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized request!" });
    }

    const isUserLikedPost = post.likes.includes(
      new mongoose.Types.ObjectId(userId)
    );

    if (isUserLikedPost) {
      // disliked
      await Post.updateOne({ _id: id }, { $pull: { likes: userId } });
      return res.status(200).json({
        success: true,
        message: "Post disliked",
        postId: id,
        userId,
        flag: false,
      });
    } else {
      // Like
      post.likes.push(new mongoose.Types.ObjectId(userId));
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Post liked",
        postId: id,
        userId,
        flag: true,
      });
    }
  } catch (error) {
    console.error("Like post error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

/**
 * ROUTE: /api/v1/posts/comment/:id
 * METHOD: PUT
 */
export const commentOnPost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.user?._id;
    const { comment } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found!" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized request!" });
    }

    post.comments.push({
      comUserId: new mongoose.Types.ObjectId(userId),
      comment,
    });
    await post.save();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      post,
    });
  } catch (error) {
    console.error("Comment post error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

/**
 * ROUTE: /api/v1/posts/bookmark/:id
 * METHOD: PUT
 */
export const bookmarkPost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const postId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Unauthorized: User not found!" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found!" });
    }

    const isAlreadyBookmarked = user.savedPosts.includes(
      post._id as mongoose.Types.ObjectId
    );

    if (isAlreadyBookmarked) {
      // Remove bookmark
      user.savedPosts = user.savedPosts.filter(
        (savedPostId) => String(savedPostId) !== String(post._id)
      );
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Post removed from bookmarks",
        post,
        flag: false,
      });
    } else {
      // Add bookmark
      user.savedPosts.push(post._id as mongoose.Types.ObjectId);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Post bookmarked successfully",
        post,
        flag: true,
      });
    }
  } catch (error) {
    console.error("Bookmarked post error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

/**
 * ROUTE: /api/v1/posts/bookmarks
 * METHOD: GET
 */
export const getBookmarkedPosts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId)
      .select("savedPosts")
      .populate({
        path: "savedPosts",
        select: "postType video image text createdBy likes comments tags createdAt",
        populate: {
          path: "createdBy",
          select: "name username profileImage",
        },
      });

    return res.status(200).json({
      success: true,
      message: "Bookmarked posts fetched successfully",
      posts: user?.savedPosts.reverse() || [],
    });
  } catch (error) {
    console.error("Delete post error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

/**
 * ROUTE: /api/v1/posts/:id
 * METHOD: DELETE
 */
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const postId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Unauthorized: User not found!" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Unauthorized: Post not found!" });
    }

    if (String(post.createdBy) !== String(user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete post!" });
    }

    await Post.findByIdAndDelete(postId);

    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

/**
 * ROUTE: /api/v1/posts
 * METHOD: GET
 */
export const userPostFeed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Pagination parameters
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(10, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    // --- Following feed ---
    const followingFeed = await Post.find({
      createdBy: { $in: [...user.following, user._id] },
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username profileImage name")
      .lean();

    // --- Most liked posts ---
    const mostLikedPosts = await Post.aggregate([
      { $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
      { $sort: { likesCount: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
          pipeline: [{ $project: { username: 1, profileImage: 1, name: 1 } }],
        },
      },
      { $unwind: "$createdBy" },
    ]);

    // --- Most commented posts ---
    const mostCommentedPosts = await Post.aggregate([
      {
        $addFields: {
          commentsCount: { $size: { $ifNull: ["$comments", []] } },
        },
      },
      { $sort: { commentsCount: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
          pipeline: [{ $project: { username: 1, profileImage: 1, name: 1 } }],
        },
      },
      { $unwind: "$createdBy" },
    ]);

    // --- Trending tags ---
    const trendingTags = await Post.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $match: { count: { $gte: 5 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // --- Trending posts ---
    const trendingPosts = trendingTags.length
      ? await Post.find({ tags: { $in: trendingTags.map((t) => t._id) } })
          .sort({ createdAt: -1 })
          .populate("createdBy", "username profileImage name")
          .lean()
      : [];

    // --- Merge & remove duplicates ---
    const seenPosts = new Map();
    const combinedFeed: any[] = [];

    const allPosts = [
      ...followingFeed.map((p) => ({ ...p, priority: 1 })),
      ...mostLikedPosts.map((p) => ({ ...p, priority: 2 })),
      ...mostCommentedPosts.map((p) => ({ ...p, priority: 3 })),
      ...trendingPosts.map((p) => ({ ...p, priority: 4 })),
    ];

    allPosts.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    for (const post of allPosts) {
      const postId = post._id.toString();
      if (!seenPosts.has(postId)) {
        seenPosts.set(postId, true);
        const { priority, ...cleanPost } = post;
        combinedFeed.push(cleanPost);
      }
    }

    // Calculate pagination
    const totalPosts = combinedFeed.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const paginatedFeed = combinedFeed.slice(skip, skip + limit);

    // Validate page number
    if (page > totalPages && totalPosts > 0) {
      return res.status(400).json({
        success: false,
        message: `Page ${page} does not exist. Maximum page is ${totalPages}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User feed fetched successfully",
      data: {
        feed: paginatedFeed,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalPosts,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
        categories: {
          following: followingFeed.length,
          mostLiked: mostLikedPosts.length,
          mostCommented: mostCommentedPosts.length,
          trending: trendingPosts.length,
        },
      },
    });
  } catch (error) {
    console.error("Feed fetching error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching feed",
    });
  }
};
