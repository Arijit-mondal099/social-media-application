import { getTrendingPostsByTag } from "@/features/post/postThunks";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PostCard } from "@/components/common/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

const TrendingPostsPage: React.FC = () => {
  const { posts, loading } = useAppSelector((state) => state.post);
  const { tag } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTrendingPostsByTag(tag!));
  }, [dispatch, tag]);

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
        <div
          onClick={() => navigate(-1)}
          className="text-gray-500 flex items-center gap-2 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </div>

        <h1 className="text-2xl font-bold mb-6 italic">#{tag}</h1>
      </motion.div>

      {posts.length === 0 && loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <Card className="bg-card rounded-lg p-4 space-y-4" key={i}>
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
          ))
        : posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="w-full"
            >
              <PostCard post={post} />
            </motion.div>
          ))}

      {/* Loading skeleton for subsequent pages */}
      {loading &&
        posts.length > 0 &&
        Array.from({ length: 2 }).map((_, i) => (
          <Card
            className="bg-card rounded-lg p-4 space-y-4"
            key={`loading-${i}`}
          >
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
        ))}

      {/* Intersection observer target */}
      <p className="text-gray-500">No more posts</p>
    </motion.div>
  );
};

export default TrendingPostsPage;
