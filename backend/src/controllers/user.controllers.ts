import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateUsername } from "../utils/generateUsername";
import { generateToken } from "../utils/generateToken";
import { AuthRequest } from "../middlewares/auth";
import { Post } from "../models/post.model";
import { uploadFile } from "../utils/uploadToImagekit";

/**
 * ROUTE: /api/v1/users/register
 * METHOD: POST
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "all fields are reqired!",
      });
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "user alredy exist with credentials!",
      });
    }

    const user = await User.create({
      name: name,
      email: email,
      username: generateUsername(name),
      password,
    });

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      user: user.toObject(),
    });
  } catch (error) {
    console.error("user register error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error,
    });
  }
};

/**
 * ROUTE: /api/v1/users/login
 * METHOD: POST
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if ((!username?.trim() && !email?.trim()) || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username or Email and Password are required!",
      });
    }

    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "invalid credentials!",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "invalid credentials!",
      });
    }

    const token = generateToken({
      id: String(user._id),
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      message: "user loggedin successfully",
      token,
    });
  } catch (error) {
    console.error("user login error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error,
    });
  }
};

/**
 * ROUTE: /api/v1/users/updateprofile-image
 * METHOD: PUT
 */
export const updateProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req?.user?._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadFile(file, "/friends");

    if (!result.url) {
      return res.status(400).json({
        success: false,
        message: "Faild to upload please try again!",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found unauthorized request!",
      });
    }

    user.profileImage = result.url;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User profile image updated successfully",
      url: user.profileImage,
    });
  } catch (error) {
    console.error("user update profile image error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error,
    });
  }
};

/**
 * ROUTE: /api/v1/users/updateprofile-info
 * METHOD: PUT
 */
export const updateProfileInfo = async (req: AuthRequest, res: Response) => {
  try {
    const { name, username, bio, link } = req.body;
    const userId = req?.user?._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found unauthorized request!",
      });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    if (username && username !== user.username) {
      const isUsernameUsed = await User.findOne({ username: username });

      if (isUsernameUsed) {
        return res.status(400).json({
          success: false,
          message: "Username alredy used!",
        });
      }

      user.username = username;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated succcessfully",
      user: {
        name: user.name,
        username: user.username,
        link: user.link,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("user update profile info error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error,
    });
  }
};

/**
 * ROUTE: /api/v1/users/change-email
 * METHOD: PUT
 */
export const changeEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;
    const userId = req.user?._id;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an valid email address!",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Oops user not found please login again!",
      });
    }

    const isEmailUsed = await User.findOne({ email });

    if (isEmailUsed) {
      return res.status(400).json({
        success: false,
        message: "Oops email alredy used try another one!",
      });
    }

    user.email = email;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email changed successfully",
      email: user.email,
    });
  } catch (error) {
    console.error("Error while changeing email", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error,
    });
  }
};

/**
 * ROUTE: /api/v1/users/change-password
 * METHOD: PUT
 */
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?._id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old & new password!",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Oops user not found please login again!",
      });
    }

    const isPasswordMatched = await user.comparePassword(oldPassword);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid old password!",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error while changeing password", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error,
    });
  }
};

/**
 * ROUTE: /api/v1/users/save-posts
 * METHOD: PUT
 */
export const savePost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.body;
    const userId = req?.user?._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found!",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found unauthorized request!",
      });
    }

    user.savedPosts.push(postId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Post saved",
    });
  } catch (error) {
    console.error("user saved post error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error,
    });
  }
};

/**
 * ROUTE: /api/v1/users
 * METHOD: GET
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId)
      .select("-password")
      .populate("posts")
      .populate("savedPosts");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found unauthorized request!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "success",
      user,
    });
  } catch (error) {
    console.error("Profile get error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error,
    });
  }
};

/**
 * ROUTE: /api/v1/users/posts
 * METHOD: GET
 */
export const getUserPosts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found unauthorized request!",
      });
    }

    const posts = await Post.find({ createdBy: userId })
      .populate("createdBy", "name username profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "User posts fetched",
      posts,
    });
  } catch (error) {
    console.error("Profile get error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error,
    });
  }
};
