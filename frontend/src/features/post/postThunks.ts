import { axiosInstance } from "@/lib/axios";
import { IComment, IExplore as IExploreResponse, IPost } from "@/types";
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
      hasNextPage: boolean;
      hasPreviousPage: boolean;
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
  comment: IComment;
}

interface IGetTrendingPostsByTagResponse {
  success: boolean;
  message: string;
  posts: IPost[];
}

export const getUserFeed = createAsyncThunk<
  IResponseFeed,
  { page?: number },
  { rejectValue: string }
>("post/getUserFeed", async ({ page = 1 }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<IResponseFeed>("/posts", {
      params: { page, limit: 10 },
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
      error.response?.data?.message || "Failed to like or unlike the post"
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
      error.response?.data?.message || "Failed to fetch post"
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

export const getReels = createAsyncThunk(
  "post/getReels",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/reels?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getExploreContent = createAsyncThunk<
  IExploreResponse,
  void,
  { rejectValue: string }
>("post/explore-data", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<IExploreResponse>(
      "/posts/explore",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to add comment to the post"
    );
  }
});

export const getTrendingPostsByTag = createAsyncThunk<
  IGetTrendingPostsByTagResponse,
  string,
  { rejectValue: string }
>("post/trending-posts-data", async (tag, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<IGetTrendingPostsByTagResponse>(
      `/posts/trending/${tag}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to add comment to the post"
    );
  }
});
