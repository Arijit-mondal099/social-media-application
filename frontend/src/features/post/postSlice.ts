import { IPost } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import {
  addCommentOnPost,
  getPostById,
  getUserFeed,
  likeToAnPost,
  getReels,
} from "./postThunks";
import { IReel } from "@/pages/ReelsPage";

interface IPostSlice {
  posts: IPost[];
  reels: IReel[];
  post: IPost | null;
  loading: boolean;
  error: string | null;
}

const initialState: IPostSlice = {
  posts: [],
  reels: [],
  post: null,
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    resetReels: (state) => {
      state.reels = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user feed posts
      .addCase(getUserFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const newFeed = action.payload.data.feed;
        
        // On first page, replace; on subsequent pages, append
        if (action.meta.arg.page === 1) {
          state.posts = newFeed;
        } else {
          // Remove duplicates before appending
          const existingIds = new Set(state.posts.map((p) => p._id));
          const uniqueNewPosts = newFeed.filter(
            (p) => !existingIds.has(p._id)
          );
          state.posts.push(...uniqueNewPosts);
        }
      })
      .addCase(getUserFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get reels
      .addCase(getReels.pending, (state) => {
        if (state.reels.length === 0) state.loading = true;
        state.error = null;
      })
      .addCase(getReels.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const newReel = action.payload.data.reel;
        if (newReel && !state.reels.some((r) => r._id === newReel._id)) {
          state.reels.push(newReel);
        }
      })
      .addCase(getReels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle like to a post/reel
      .addCase(likeToAnPost.pending, (state) => {
        state.error = null;
      })
      .addCase(likeToAnPost.fulfilled, (state, action) => {
        state.error = null;
        const { postId, userId, flag } = action.payload;

        // Update in posts array
        state.posts = state.posts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: flag
                ? [...post.likes, userId]
                : post.likes.filter((id) => id !== userId),
            };
          }
          return post;
        });

        // Update in reels array
        state.reels = state.reels.map((reel) => {
          if (reel._id === postId) {
            return {
              ...reel,
              likes: flag
                ? [...reel.likes, userId]
                : reel.likes.filter((id) => id !== userId),
            };
          }
          return reel;
        });

        // Update single post
        if (state.post && state.post._id === postId) {
          state.post = {
            ...state.post,
            likes: flag
              ? [...state.post.likes, userId]
              : state.post.likes.filter((id) => id !== userId),
          };
        }
      })
      .addCase(likeToAnPost.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Get post by id
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.post = action.payload.post;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // add comment to a post
      .addCase(addCommentOnPost.pending, (state) => {
        state.error = null;
      })
      .addCase(addCommentOnPost.fulfilled, (state, action) => {
        state.error = null;
        state.post?.comments.unshift(action.payload.comment);
      })
      .addCase(addCommentOnPost.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetReels } = postSlice.actions;
export default postSlice.reducer;