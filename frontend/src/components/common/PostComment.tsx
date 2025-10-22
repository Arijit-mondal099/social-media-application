import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AI_ICON, defaultProfileImage } from "@/assets";
import { formatDistanceStrict } from "date-fns";
import { AutoPlayVideo } from "./AutoPlayVideo";
import { Button } from "../ui/button";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Share,
  Send,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  addCommentOnPost,
  getPostById,
  likeToAnPost,
} from "@/features/post/postThunks";
import { bookmarkPost } from "@/features/user/userThunks";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const PostComment: React.FC = () => {
  const { post, loading } = useAppSelector((state) => state.post);
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { postId } = useParams<{ postId: string }>();
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleLikeToggleToPost = async (postId: string) => {
    const res = await dispatch(likeToAnPost(postId));
    if (!likeToAnPost.fulfilled.match(res)) {
      toast.error(res.payload || "Unable to like the post");
    }
  };

  const handleBookmarkToggleToPost = async (postId: string) => {
    const res = await dispatch(bookmarkPost(postId));
    if (bookmarkPost.fulfilled.match(res)) {
      toast.success(res.payload.message || "Bookmark updated");
    } else {
      toast.error(res.payload || "Unable to bookmark");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return toast.error("Comment cannot be empty");

    setIsSubmittingComment(true);
    try {
      const res = await dispatch(
        addCommentOnPost({ postId: postId!, comment: commentText.trim() })
      );

      if (addCommentOnPost.fulfilled.match(res)) {
        toast.success(res.payload.message || "Comment added successfully");
      } else {
        toast.error(res.payload || "Failed to add comment");
      }
      setCommentText("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  useEffect(() => {
    dispatch(getPostById(postId!));
  }, [dispatch, postId]);

  if (loading || !post) {
    return (
      <div className="max-w-2xl mx-auto p-4 mt-10 mb-40 animate-pulse space-y-4">
        {/* Post Card Skeleton */}
        <Card className="bg-card rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-40 h-4 rounded-md" />
                <Skeleton className="w-32 h-3 rounded-md" />
              </div>
            </div>
            <Skeleton className="w-10 h-8 rounded-md" />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Skeleton className="w-20 h-6 rounded-md" />
            <Skeleton className="w-16 h-6 rounded-md" />
            <Skeleton className="w-24 h-6 rounded-md" />
          </div>

          <div className="pt-2 space-y-2">
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-5/6 h-4 rounded-md" />
            <Skeleton className="w-3/4 h-4 rounded-md" />
            <Skeleton className="w-full h-48 rounded-lg" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Skeleton className="w-10 h-8 rounded-md" />
            <Skeleton className="w-10 h-8 rounded-md" />
            <Skeleton className="w-10 h-8 rounded-md" />
            <Skeleton className="w-10 h-8 rounded-md" />
          </div>
        </Card>

        {/* Comments Card Skeleton */}
        <Card className="bg-card rounded-lg p-4 space-y-4">
          {/* Comment Form Skeleton */}
          <div className="flex gap-3 items-start">
            <Skeleton className="w-9 h-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-full h-20 rounded-md" />
              <div className="flex justify-end">
                <Skeleton className="w-28 h-8 rounded-md" />
              </div>
            </div>
          </div>

          {/* Comments List Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-muted/10 rounded-md p-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="w-40 h-4 rounded-md" />
                      <Skeleton className="w-24 h-3 rounded-md" />
                    </div>
                    <Skeleton className="w-full h-4 rounded-md" />
                    <Skeleton className="w-5/6 h-4 rounded-md" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto p-4 mb-40"
    >
      <div
        onClick={() => navigate(-1)}
        className="text-left flex items-center gap-2 text-sm text-gray-400 cursor-pointer mt-10 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back</span>
      </div>

      {/* --- Post Card --- */}
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

            <Button variant={"ghost"} title="Ask to AI about this post">
              <img src={AI_ICON} alt="AI" className="w-4 h-4" />
            </Button>
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
            <div className="w-full h-auto max-w-lg space-y-2 pb-2">
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
                post.likes.includes(user?._id || "")
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500"
              }`}
              onClick={() => handleLikeToggleToPost(post._id)}
            >
              <Heart
                className={`w-4 h-4 ${
                  post.likes.includes(user?._id || "") && "fill-red-500"
                }`}
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
                user?.savedPosts.some((p) => p._id === post._id)
                  ? "text-yellow-500"
                  : "text-muted-foreground hover:text-yellow-500"
              }`}
              onClick={() => handleBookmarkToggleToPost(post._id)}
            >
              <Bookmark
                className={`w-4 h-4 ${
                  user?.savedPosts.some((p) => p._id === post._id) &&
                  "fill-yellow-500"
                }`}
              />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* --- Comments Section --- */}
      <Card className="mt-4 p-4">
        {/* Post Comment Form */}
        <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
          <Avatar className="w-9 h-9 flex-shrink-0 mt-1">
            <AvatarImage
              src={user?.profileImage || defaultProfileImage}
              alt={user?.name}
            />
          </Avatar>

          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full text-sm p-3 rounded-lg border bg-muted/20 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
            />
            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingComment || !commentText.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white w-28"
              >
                {isSubmittingComment ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-1" />
                )}
                {isSubmittingComment ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <section className="space-y-4">
          {post.comments.length > 0 ? (
            post.comments.map((comment, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={
                              comment.comUserId.profileImage ||
                              defaultProfileImage
                            }
                            alt={comment.comUserId.name}
                          />
                        </Avatar>
                      </motion.div>

                      <div>
                        <div className="w-full flex items-center space-x-1">
                          <span className="font-semibold text-sm">
                            {comment.comUserId.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>@{comment.comUserId.username}</span>
                          {formatDistanceStrict(
                            new Date(comment.createdAt),
                            new Date(),
                            {
                              addSuffix: true,
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="mt-1 text-sm whitespace-pre-wrap leading-relaxed text-left">
                    {comment.comment}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No comments yet — be the first!
            </div>
          )}
        </section>
      </Card>
    </motion.section>
  );
};

export default PostComment;
