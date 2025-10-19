import { IPost } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { getUserFeed, likeToAnPost } from "./postThunks";

interface IPostSlice {
  posts: IPost[];
  loading: boolean;
  error: string | null;
}

const initialState: IPostSlice = {
  posts: [],
  loading: false,
  error: null,
};

const counterSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get user feed posts
      .addCase(getUserFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts = action.payload.data.feed;
      })
      .addCase(getUserFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // toggle like to a post
      .addCase(likeToAnPost.pending, (state) => {
        state.error = null;
      })
      .addCase(likeToAnPost.fulfilled, (state, action) => {
        state.error = null;
        state.posts = state.posts.map((post) => {
          if (post._id === action.meta.arg) {
            return {
              ...post,
              likes: action.payload.flag
                ? [...post.likes, action.payload.userId] 
                : post.likes.filter((id) => id !== action.payload.userId),
            };
          }
          return post;
        });
      })
      .addCase(likeToAnPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default counterSlice.reducer;
