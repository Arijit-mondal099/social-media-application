import { axiosInstance } from "@/lib/axios";
import { IComment, IPost } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface IResponseFeed {
  success: boolean;
  message: string;
  data: {
    feed: IPost[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalPosts: number;
      totalPages: number;
      hasNextPage: number;
      hasPreviousPage: number;
    };
    categories: {
      following: number;
      mostLiked: number;
      mostCommented: number;
      trending: number;
    };
  };
}

interface ILikePostResponse {
  success: boolean;
  message: string;
  flag: boolean;
  userId: string;
  postId: string;
}

interface IGetPostByIdResponse {
  success: boolean;
  message: string;
  post: IPost;
}

interface AddCommentResponse {
  success: boolean;
  message: string;
  comment: IComment[];
}

export const getUserFeed = createAsyncThunk<
  IResponseFeed,
  void,
  { rejectValue: string }
>("post/getUserFeed", async (_, { rejectWithValue }) => {
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

export const likeToAnPost = createAsyncThunk<
  ILikePostResponse,
  string,
  { rejectValue: string }
>("post/likeToAnPost", async (postId, { rejectWithValue }) => {
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

export const getPostById = createAsyncThunk<
  IGetPostByIdResponse,
  string,
  { rejectValue: string }
>("post/getPostById", async (postId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<IGetPostByIdResponse>(
      `/posts/${postId}`,
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

export const addCommentOnPost = createAsyncThunk<
  AddCommentResponse,
  { postId: string; comment: string },
  { rejectValue: string }
>("post/addCommentOnPost", async ({ postId, comment }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<AddCommentResponse>(
      `/posts/comment/${postId}`,
      { comment },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to add comment to the post"
    );
  }
});
