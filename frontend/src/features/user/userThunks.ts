import { axiosInstance } from "@/lib/axios";
import { IAuth, IAuthResponse, IPost } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface IPostData {
  image?: File;
  video?: File;
  text?: string;
  tags: string[];
}

interface IResponsePost {
  success: boolean;
  message: string;
  post?: IPost;
  posts?: IPost[];
}

interface ILikePostResponse {
  success: boolean;
  message: string;
  flag: boolean;
  userId: string;
  postId: string;
}

interface IUpdateUserProfileResponse {
  success: boolean;
  message: string;
  user: { name: string; username: string; link: string; bio: string };
}

interface IToggleFollowResponse {
  success: boolean;
  message: string;
  followingUser: string;
  followersUser: string;
}

export const register = createAsyncThunk<
  IAuthResponse,
  IAuth,
  { rejectValue: string }
>("user/register", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<IAuthResponse>(
      "/users/register",
      data
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Registration failed"
    );
  }
});

export const login = createAsyncThunk<
  IAuthResponse,
  IAuth,
  { rejectValue: string }
>("user/login", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<IAuthResponse>(
      "/users/login",
      data
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const profile = createAsyncThunk<
  IAuthResponse,
  void,
  { rejectValue: string }
>("user/profile", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<IAuthResponse>("/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile"
    );
  }
});

export const getProfileByUsername = createAsyncThunk<
  IAuthResponse,
  string,
  { rejectValue: string }
>("user/getProfileByUsername", async (username, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<IAuthResponse>(
      `/users/${username}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile"
    );
  }
});

export const likeToAnPostOnSelectedUser = createAsyncThunk<
  ILikePostResponse,
  string,
  { rejectValue: string }
>("post/likeToAnPostOnSelectedUser", async (postId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<ILikePostResponse>(
      `/posts/${postId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Faild to like or unlike the post"
    );
  }
});

export const toggleFollow = createAsyncThunk<
  IToggleFollowResponse,
  string,
  { rejectValue: string }
>("user/toggleFollow", async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<IToggleFollowResponse>(
      `/users/toggle-follow/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to toggle follow/unfollow"
    );
  }
});

export const textPost = createAsyncThunk<
  IResponsePost,
  IPostData,
  { rejectValue: string }
>("user/textPost", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<IResponsePost>(
      "/posts/text",
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Registration failed"
    );
  }
});

export const imagePost = createAsyncThunk<
  IResponsePost,
  FormData,
  { rejectValue: string }
>("user/imagePost", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<IResponsePost>(
      "/posts/image",
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Registration failed"
    );
  }
});

export const videoPost = createAsyncThunk<
  IResponsePost,
  FormData,
  { rejectValue: string }
>("user/videoPost", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<IResponsePost>(
      "/posts/video",
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Registration failed"
    );
  }
});

export const getUserPosts = createAsyncThunk<
  IResponsePost,
  void,
  { rejectValue: string }
>("user/getUserPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<IResponsePost>("/users/posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch user posts"
    );
  }
});

export const deletePost = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>("user/deletePost", async (data, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/posts/${data.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return data.id;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete user posts"
    );
  }
});

export const updateProfile = createAsyncThunk<
  IUpdateUserProfileResponse,
  { name: string; username: string; link: string; bio: string },
  { rejectValue: string }
>("user/updateProfile", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(
      "/users/updateprofile-info",
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to update profile"
    );
  }
});

export const updateProfileImage = createAsyncThunk<
  { success: boolean; message: string; url: string },
  FormData,
  { rejectValue: string }
>("user/updateProfileImage", async (file, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(
      "/users/updateprofile-image",
      file,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to update profile image"
    );
  }
});

export const updateEmail = createAsyncThunk<
  { success: boolean; message: string; email: string },
  { email: string },
  { rejectValue: string }
>("user/updateEmail", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put("/users/change-email", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to update email"
    );
  }
});

export const updatePassword = createAsyncThunk<
  object,
  { oldPassword: string; newPassword: string },
  { rejectValue: string }
>("user/updatePassword", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put("/users/change-password", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to change password"
    );
  }
});

export const bookmarkPost = createAsyncThunk<
  { success: boolean; message: string; post: IPost; flag: boolean },
  string,
  { rejectValue: string }
>("user/bookmarkPost", async (postId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(
      `/posts/bookmark/${postId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to bookmark the post"
    );
  }
});

export const getBookmarkPosts = createAsyncThunk<
  { success: boolean; message: string; posts: IPost[] },
  void,
  { rejectValue: string }
>("user/getBookmarkPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/posts/bookmarks", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch bookmarked posts"
    );
  }
});

export const deleteUserAccount = createAsyncThunk<
  { success: boolean; message: string },
  void,
  { rejectValue: string }
>("user/deleteUserAccount", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete("/users/delete-account", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch bookmarked posts"
    );
  }
});
