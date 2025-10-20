import { createSlice } from "@reduxjs/toolkit";
import { IPost, IUser } from "@/types";
import {
  bookmarkPost,
  deletePost,
  deleteUserAccount,
  getBookmarkPosts,
  getUserPosts,
  imagePost,
  login,
  profile,
  register,
  textPost,
  updateEmail,
  updatePassword,
  updateProfile,
  updateProfileImage,
  videoPost,
} from "./userThunks";

export interface IUserState {
  user: IUser | null;
  token: string | null;
  posts: IPost[];
  bookmarkedPosts: IPost[];
  error: string | null;
  authChecking: boolean;
  loading: boolean;
}

const initialState: IUserState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  posts: [],
  bookmarkedPosts: [],
  authChecking: false,
  loading: false,
  error: null,
};

const counterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // register user
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // login user
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token!;
        localStorage.setItem("token", state.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetch user profile
      .addCase(profile.pending, (state) => {
        state.authChecking = true;
        state.error = null;
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.authChecking = false;
        state.user = action.payload.user!;
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(profile.rejected, (state, action) => {
        state.authChecking = false;
        state.error = action.payload as string;
      })
      // text
      .addCase(textPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(textPost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts = [action.payload.post!, ...state.posts];
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
        state.posts = [action.payload.post!, ...state.posts];
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
        state.posts = [action.payload.post!, ...state.posts];
      })
      .addCase(videoPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // user profile
      .addCase(getUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts = action.payload.posts!;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // update user profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = {
          ...state.user,
          ...action.payload.user,
        };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // update user profile image
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = { ...state.user, profileImage: action.payload.url };
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // update user email
      .addCase(updateEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = { ...state.user, email: action.payload.email };
      })
      .addCase(updateEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // change password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // toggle bookmark post
      .addCase(bookmarkPost.pending, (state) => {
        state.error = null;
      })
      .addCase(bookmarkPost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload.flag) {
          // added to bookmarks
          state.bookmarkedPosts = [
            action.payload.post!,
            ...state.bookmarkedPosts,
          ];
          state.user?.savedPosts.push(action.payload.post!);
        } else {
          // removed from bookmarks
          state.bookmarkedPosts = state.bookmarkedPosts.filter(
            (post) => post._id !== action.payload.post!._id
          );
          state.user!.savedPosts = state.user!.savedPosts.filter(
            (post) => post._id !== action.payload.post!._id
          );
        }
      })
      .addCase(bookmarkPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetch bookmark posts
      .addCase(getBookmarkPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookmarkPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.bookmarkedPosts = action.payload.posts!;
      })
      .addCase(getBookmarkPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // delete usee account
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = counterSlice.actions;
export default counterSlice.reducer;
