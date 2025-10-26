import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  deletePost,
  getBookmarkPosts,
  getProfileByUsername,
  getUserPosts,
  toggleFollow,
  // followUnfollowUser, // wire this thunk when ready
} from "@/features/user/userThunks";
import { toast } from "sonner";
import { PostCard } from "@/components/common/PostCard";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { defaultProfileImage } from "@/assets";

export const ProfilePage: React.FC = () => {
  const { user, selectedUserProfile, loading, posts, bookmarkedPosts } =
    useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { username } = useParams();

  const isYourProfile = user?.username === username;
  const isFollowing = selectedUserProfile?.followers?.includes(user?._id || "");

  const handleDeletePost = async (id: string) => {
    const res = await dispatch(deletePost({ id }));
    if (deletePost.fulfilled.match(res)) {
      toast.success("Post deleted successfully");
    } else {
      toast.error(res.payload as string);
    }
  };

  const handleFollowToggle = async () => {
    if (!selectedUserProfile || !selectedUserProfile?._id) return;

    const res = await dispatch(toggleFollow(selectedUserProfile._id));
    if (toggleFollow.fulfilled.match(res)) {
      toast.success(res.payload.message);
    } else {
      toast.error(res.payload);
    }
  };

  useEffect(() => {
    if (isYourProfile) dispatch(getUserPosts());
    if (isYourProfile) dispatch(getBookmarkPosts());
    if (!isYourProfile && username) dispatch(getProfileByUsername(username));
  }, [dispatch, username, isYourProfile]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6 my-10 space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="flex mt-2">
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>

                <div className="mt-3">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto px-4 py-6"
    >
      {/* Profile Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-card rounded-lg p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Avatar className="w-32 h-32 border-4 border-primary/20">
              <AvatarImage
                src={
                  isYourProfile
                    ? user?.profileImage || defaultProfileImage
                    : selectedUserProfile?.profileImage || defaultProfileImage
                }
              />
            </Avatar>
          </motion.div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">
              {isYourProfile ? user?.name : selectedUserProfile?.name}
            </h1>
            <p className="text-muted-foreground mb-2">
              @{isYourProfile ? user?.username : selectedUserProfile?.username}
            </p>

            {!isYourProfile && (
              <div className="flex gap-2 mb-4">
                <Button
                  variant={isFollowing ? "secondary" : "default"}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>

                <Button>Message</Button>
              </div>
            )}

            {isYourProfile
              ? user?.bio && (
                  <p className="text-sm mb-4">{selectedUserProfile?.bio}</p>
                )
              : selectedUserProfile?.bio && (
                  <p className="text-sm mb-4">{selectedUserProfile?.bio}</p>
                )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground mb-4">
              {isYourProfile
                ? user?.createdAt && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined {format(new Date(user?.createdAt), "MMMM yyyy")}
                      </span>
                    </div>
                  )
                : selectedUserProfile?.createdAt && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined{" "}
                        {format(
                          new Date(selectedUserProfile?.createdAt),
                          "MMMM yyyy"
                        )}
                      </span>
                    </div>
                  )}

              {isYourProfile
                ? user?.link && (
                    <div className="flex items-center space-x-1">
                      <LinkIcon className="w-4 h-4" />
                      <a
                        href={user?.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user?.link}
                      </a>
                    </div>
                  )
                : selectedUserProfile?.link && (
                    <div className="flex items-center space-x-1">
                      <LinkIcon className="w-4 h-4" />
                      <a
                        href={selectedUserProfile?.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {selectedUserProfile?.link}
                      </a>
                    </div>
                  )}
            </div>

            <div className="flex items-center justify-center sm:justify-start space-x-6 text-sm">
              <div>
                <span className="font-semibold">
                  {isYourProfile
                    ? posts.length
                    : selectedUserProfile?.posts?.length ?? 0}
                </span>
                <span className="text-muted-foreground ml-1">Posts</span>
              </div>
              <div>
                <span className="font-semibold">
                  {isYourProfile
                    ? user?.followers?.length
                    : selectedUserProfile?.followers?.length ?? 0}
                </span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </div>
              <div>
                <span className="font-semibold">
                  {isYourProfile
                    ? user?.following?.length
                    : selectedUserProfile?.following?.length ?? 0}
                </span>
                <span className="text-muted-foreground ml-1">Following</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-4xl"
      >
        <Tabs defaultValue="posts" className="w-full">
          <TabsList
            className={`grid w-full ${
              isYourProfile ? "grid-cols-2 gap-2" : "grid-cols-1"
            }`}
          >
            <TabsTrigger value="posts">Posts</TabsTrigger>
            {isYourProfile && <TabsTrigger value="saved">Saved</TabsTrigger>}
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="grid gap-4">
              {/* user posts */}
              {isYourProfile ? (
                posts?.length ? (
                  posts.map((p) => (
                    <PostCard
                      key={p._id}
                      post={p}
                      onDelete={handleDeletePost}
                    />
                  ))
                ) : (
                  <p>No posts to display!</p>
                )
              ) : selectedUserProfile?.posts?.length ? (
                selectedUserProfile.posts.map((p) => (
                  <PostCard key={p._id} post={p} isSelectedUserProfile={true} />
                ))
              ) : (
                <p>No posts to display!</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <div className="grid gap-4">
              {bookmarkedPosts?.length ? (
                bookmarkedPosts.map((p) => (
                  <PostCard
                    key={p._id}
                    post={p}
                    isSelectedUserProfile={
                      p.createdBy.username !== user?.username
                    }
                  />
                ))
              ) : (
                <p>No posts to display!</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};
