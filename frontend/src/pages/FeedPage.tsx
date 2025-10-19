import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { PostCard } from "@/components/common/PostCard";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getUserFeed } from "@/features/post/postThunks";
import { Skeleton } from "@/components/ui/skeleton";

export interface IComment {
  _id: string;
  user: string;
  text: string;
  createdAt: string;
}

export const FeedPage: React.FC = () => {
  const { posts, loading } = useAppSelector((state) => state.post);
  const dispatch = useAppDispatch();

  const toggleLike = (postId: string) => {
    console.log("Liked post", postId);
  };

  const toggleBookmark = (postId: string) => {
    console.log("Bookmarked post", postId);
  };

  useEffect(() => {
    dispatch(getUserFeed());
  }, [dispatch]);

  console.log(posts);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full px-2 py-6 space-y-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
      </motion.div>

      {loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col space-y-3 border p-4 rounded-lg"
            >
              <Skeleton className="h-[350px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))
        : posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full"
            >
              <PostCard
                post={post}
                onLike={toggleLike}
                onBookmark={toggleBookmark}
              />
            </motion.div>
          ))}
    </motion.div>
  );
};
