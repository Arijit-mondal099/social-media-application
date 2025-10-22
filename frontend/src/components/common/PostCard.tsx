import React from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share, Bookmark, Trash2 } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IPost } from "@/types";
import { formatDistanceStrict } from "date-fns";
import { Button } from "../ui/button";
import { AutoPlayVideo } from "./AutoPlayVideo";
import ConfirmModal from "../modals/ConfirmModal";
import { AI_ICON, defaultProfileImage } from "@/assets";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { likeToAnPost } from "@/features/post/postThunks";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/useAppSelector";
import { bookmarkPost } from "@/features/user/userThunks";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: IPost;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isUserLikedPost = post.likes.includes(user?._id || "");
  const isPostBookmarked = user?.savedPosts.some((p) => p._id === post._id);

  const handleLikeToggleToPost = async (postId: string) => {
    const res = await dispatch(likeToAnPost(postId));

    if (!likeToAnPost.fulfilled.match(res)) {
      toast.success(res.payload || "Unable to like the post");
    }
  };

  const handleBookmarkToggleToPost = async (postId: string) => {
    const res = await dispatch(bookmarkPost(postId));

    if (bookmarkPost.fulfilled.match(res)) {
      toast.success(res.payload.message || "Post bookmark toggled");
    } else {
      toast.success(res.payload || "Unable to bookmark the post");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={post.createdBy.profileImage || defaultProfileImage}
                  />
                </Avatar>
              </motion.div>
              <div>
                <div className="w-full flex items-center space-x-1">
                  <span className="font-semibold text-sm">
                    {post.createdBy.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>@{post.createdBy.username}</span>
                  {formatDistanceStrict(new Date(post?.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>

            {!onDelete && (
              <Button variant={"ghost"} title="Ask to AI about this post">
                <img src={AI_ICON} alt="AI" className="w-4 h-4" />
              </Button>
            )}

            {onDelete && (
              <ConfirmModal
                title="Delete Post"
                description="Are you sure you want to delete this post? This action cannot be undone."
                btnText="Confirm"
                onConfirm={() => onDelete(post._id)}
                trigger={
                  <Button
                    variant="destructive"
                    size="sm"
                    className="p-2 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                }
              />
            )}
          </div>

          <div className="text-left text-blue-500 mb-3 flex items-center gap-1.5 flex-wrap text-xs">
            {post.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {post.postType === "text" && (
            <p className="w-full max-w-lg text-left whitespace-pre-wrap break-words">
              {post.text}
            </p>
          )}

          {post.postType === "image" && (
            <div className="w-full h-auto max-w-lg space-y-2 pb-6">
              <img
                src={post.image}
                alt={post._id}
                className="w-full h-full rounded-lg"
              />
              <p className="w-full max-w-lg text-left whitespace-pre-wrap break-words">
                {post.text}
              </p>
            </div>
          )}

          {post.postType === "video" && (
            <AutoPlayVideo src={post.video!} text={post.text} />
          )}
        </CardContent>

        <CardFooter>
          <div className="w-full flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 ${
                isUserLikedPost
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500"
              }`}
              onClick={() => handleLikeToggleToPost(post._id)}
            >
              <Heart
                className={`w-4 h-4 ${isUserLikedPost && "fill-red-500"}`}
              />
              {post.likes.length}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-blue-500"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <MessageCircle className="w-4 h-4" />
              {post.comments.length}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-green-500"
            >
              <Share className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 ${
                isPostBookmarked
                  ? "text-yellow-500"
                  : "text-muted-foreground hover:text-yellow-500"
              }`}
              onClick={() => handleBookmarkToggleToPost(post._id)}
            >
              <Bookmark
                className={`w-4 h-4 ${isPostBookmarked && "fill-yellow-500"}`}
              />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
