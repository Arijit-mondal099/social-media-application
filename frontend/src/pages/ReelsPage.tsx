import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getReels, likeToAnPost } from "@/features/post/postThunks";
import { IComment } from "@/types";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Share,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { bookmarkPost } from "@/features/user/userThunks";
import { useNavigate } from "react-router-dom";

export interface IReel {
  _id: string;
  text: string;
  video: string;
  createdBy: {
    _id: string;
    username: string;
    profileImage: string;
    name: string;
  };
  likes: string[];
  comments: IComment[];
  tags: string[];
  createdAt: string;
}

export const ReelsPage: React.FC = () => {
  const { reels, loading } = useAppSelector((state) => state.post);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const observerTarget = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Fetch reels
  const loadMoreReels = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    dispatch(getReels(page + 1)).then((response: any) => {
      if (response?.payload?.data?.pagination?.hasNextPage) {
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
      setIsLoadingMore(false);
    });
  }, [page, hasMore, isLoadingMore, dispatch]);

  useEffect(() => {
    dispatch(getReels(1)).then((response: any) => {
      if (!response?.payload?.data?.pagination?.hasNextPage) {
        setHasMore(false);
      }
    });
    setPage(1);
  }, [dispatch]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreReels();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [loadMoreReels, hasMore, isLoadingMore]);

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

  // Sound toggle
  const toggleSound = (reelId: string) => {
    const videoEl = document.querySelector(
      `video[data-reelid="${reelId}"]`
    ) as HTMLVideoElement | null;

    setMutedVideos((prev) => {
      const newMuted = new Set(prev);
      if (newMuted.has(reelId)) {
        newMuted.delete(reelId);
        if (videoEl) videoEl.muted = false;
      } else {
        newMuted.add(reelId);
        if (videoEl) videoEl.muted = true;
      }
      return newMuted;
    });
  };

  // Autoplay logic per reel
  const handleVideoRef = (videoEl: HTMLVideoElement | null, reelId: string) => {
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl.muted = mutedVideos.has(reelId);
            const playPromise = videoEl.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => console.warn("Autoplay blocked"));
            }
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold: 0.9 }
    );

    observer.observe(videoEl);
    return () => observer.unobserve(videoEl);
  };

  // Keep mute state synced
  useEffect(() => {
    const videos = document.querySelectorAll("video[data-reelid]");
    videos.forEach((video) => {
      const id = video.getAttribute("data-reelid");
      if (id) (video as HTMLVideoElement).muted = mutedVideos.has(id);
    });
  }, [mutedVideos]);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <div
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
        style={{
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Loading skeletons */}
        {loading && reels.length === 0
          ? Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-screen snap-start flex items-center justify-center bg-gray-900"
              >
                <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 animate-pulse" />
              </div>
            ))
          : reels.map((reel) => (
              <motion.div
                key={reel._id}
                className="relative w-full h-screen snap-start flex items-center justify-center overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
              >
                {/* Video */}
                <video
                  ref={(el) => handleVideoRef(el, reel._id)}
                  data-reelid={reel._id}
                  src={reel.video}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  muted={mutedVideos.has(reel._id)}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />

                {/* Sound Button */}
                <motion.button
                  onClick={() => toggleSound(reel._id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-5 right-5 bg-black/50 p-3 rounded-full text-white backdrop-blur-md hover:bg-black/70 transition-colors z-30"
                >
                  {mutedVideos.has(reel._id) ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </motion.button>

                {/* Info */}
                <div className="absolute bottom-44 lg:bottom-24 left-5 z-20">
                  <div className="flex items-center gap-3 mb-3 text-left">
                    <img
                      src={reel.createdBy.profileImage || "/default-avatar.png"}
                      alt={reel.createdBy.username}
                      className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {reel.createdBy.name}
                      </p>
                      <p className="text-white/80 text-xs">
                        @{reel.createdBy.username}
                      </p>
                    </div>
                  </div>
                  {reel.text && (
                    <p className="text-white w-full max-w-80 text-left whitespace-pre-wrap break-words ">
                      {reel.text}
                    </p>
                  )}
                </div>

                {/* Button's */}
                <div className="absolute right-5 bottom-44 flex flex-col items-center gap-6 z-20 text-white">
                  {/* Like */}
                  <div
                    className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleLikeToggleToPost(reel._id)}
                  >
                    <Heart
                      className={`w-8 h-8 ${
                        reel.likes.includes(user?._id || "")
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }`}
                    />
                    <span className="text-xs mt-1">{reel.likes.length}</span>
                  </div>

                  {/* Comment */}
                  <div
                    className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => navigate(`/post/${reel._id}`)}
                  >
                    <MessageCircle className="w-8 h-8 text-white" />
                    <span className="text-xs mt-1">{reel.comments.length}</span>
                  </div>

                  {/* Share */}
                  <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
                    <Share className="w-8 h-8 text-white" />
                  </div>

                  {/* Bookmark */}
                  <div
                    className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleBookmarkToggleToPost(reel._id)}
                  >
                    <Bookmark
                      className={`w-8 h-8 ${
                        user?.savedPosts.some((p) => p._id === reel._id)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-white"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}

        {/* Infinite Scroll Loader */}
        <div
          ref={observerTarget}
          className="w-full h-32 flex items-center justify-center"
        >
          {isLoadingMore && (
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
