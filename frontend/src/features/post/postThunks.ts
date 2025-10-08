import { axiosInstance } from "@/lib/axios";
import { IPost } from "@/types";
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
  post: IPost;
}

interface IResponseFeed {
  success: boolean;
  message: string;
  data: {
    feed: [];
    totalPosts: number;
    categories: {
      following: number;
      mostLiked: number;
      mostCommented: number;
      trending: number;
    };
  };
}

export const textPost = createAsyncThunk<
  IResponsePost,
  IPostData,
  { rejectValue: string }
>("post/textPost", async (data, { rejectWithValue }) => {
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
>("post/imagePost", async (data, { rejectWithValue }) => {
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
>("post/videoPost", async (data, { rejectWithValue }) => {
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

export const userFeed = createAsyncThunk<
  IResponseFeed,
  void,
  { rejectValue: string }
>("post/userFeed", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<IResponseFeed>("/posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Fetching feed failed"
    );
  }
});
