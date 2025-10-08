import { IPost } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { imagePost, textPost, videoPost } from "./postThunks";

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
      // text
      .addCase(textPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(textPost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts.push(action.payload.post);
      })
      .addCase(textPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // image
      .addCase(imagePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(imagePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts.push(action.payload.post);
      })
      .addCase(imagePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // video
      .addCase(videoPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(videoPost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts.push(action.payload.post);
      })
      .addCase(videoPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default counterSlice.reducer;
