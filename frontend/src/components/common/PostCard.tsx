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
import { defaultProfileImage } from "@/assets";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { likeToAnPost } from "@/features/post/postThunks";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/useAppSelector";

interface PostCardProps {
  post: IPost;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const isUserLikedPost = post.likes.includes(user?._id || "");

  const handleLikeToggleToPost = async (postId: string) => {
    const res = await dispatch(likeToAnPost(postId));

    if (!likeToAnPost.fulfilled.match(res)) {
      toast.success(res.payload || "Unable to like the post");
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

          <div className="text-left mb-3 flex items-center gap-1.5 flex-wrap text-xs">
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={`flex items-center gap-2 bg-white dark:bg-black border-muted hover:border-muted 
               hover:text-red-500 transition-colors duration-300 ${
                 isUserLikedPost ? "text-red-500" : ""
               }`}
                onClick={() => handleLikeToggleToPost(post._id)}
              >
                <Heart className="w-4 h-4" />
                <span>{post.likes.length ? post.likes.length : "Like"}</span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white dark:bg-black border-muted hover:border-muted 
               hover:text-blue-500 transition-colors duration-300"
              >
                <MessageCircle className="w-4 h-4" />
                <span>0</span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white dark:bg-black border-muted hover:border-muted 
               hover:text-blue-500 transition-colors duration-300"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white dark:bg-black 
               border-muted hover:border-muted 
               hover:text-blue-500 transition-colors duration-300"
            >
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
