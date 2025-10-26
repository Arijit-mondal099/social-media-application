import React, { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { PostCard } from "@/components/common/PostCard";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getUserFeed } from "@/features/post/postThunks";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export interface IComment {
  _id: string;
  user: string;
  text: string;
  createdAt: string;
}

export const FeedPage: React.FC = () => {
  const { posts, loading } = useAppSelector((state) => state.post);
  const dispatch = useAppDispatch();
  const observerTarget = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const isLoadingRef = useRef(false);

  const loadMorePosts = useCallback(() => {
    if (isLoadingRef.current || !hasMoreRef.current) return;
    
    isLoadingRef.current = true;
    const nextPage = currentPageRef.current + 1;
    
    dispatch(getUserFeed({ page: nextPage }))
      .then((action) => {
        if (action.payload?.data?.pagination?.hasNextPage) {
          currentPageRef.current = nextPage;
          hasMoreRef.current = true;
        } else {
          hasMoreRef.current = false;
        }
      })
      .finally(() => {
        isLoadingRef.current = false;
      });
  }, [dispatch]);

  useEffect(() => {
    // Load initial feed
    dispatch(getUserFeed({ page: 1 }));
    currentPageRef.current = 1;
    hasMoreRef.current = true;
  }, [dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMoreRef.current) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, loadMorePosts]);

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
        <h1 className="text-2xl font-bold mb-6 italic">Your Feed</h1>
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
          <Card className="bg-card rounded-lg p-4 space-y-4" key={`loading-${i}`}>
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
      <div ref={observerTarget} className="py-8 text-center">
        {!hasMoreRef.current && posts.length > 0 && (
          <p className="text-gray-500">No more posts to load</p>
        )}
      </div>
    </motion.div>
  );
};