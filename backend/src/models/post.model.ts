import mongoose, { Document, Schema, Types } from "mongoose";

export interface IComment {
  comUserId: Types.ObjectId;
  comment: string;
}

export interface IPost extends Document {
  postType: "text" | "image" | "video";
  video?: string;
  image?: string;
  text: string;
  createdBy: Types.ObjectId;
  likes: Types.ObjectId[];
  comments: IComment[];
  tags: string[];
}

const CommentSchema = new Schema<IComment>(
  {
    comUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PostSchema = new Schema<IPost>(
  {
    postType: {
      type: String,
      enum: ["text", "image", "video"],
      required: true,
    },
    text: { type: String, required: true },
    video: { type: String },
    image: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", PostSchema);
