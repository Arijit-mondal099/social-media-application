import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Link as LinkIcon, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
// import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { deletePost, getUserPosts } from "@/features/user/userThunks";
import { toast } from "sonner";
import { PostCard } from "@/components/common/PostCard";

export const ProfilePage: React.FC = () => {
  const { user, posts } = useAppSelector((state) => state.user);
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleDeletePost = async (id: string) => {
    const res = await dispatch(deletePost({ id }));
    if (deletePost.fulfilled.match(res)) {
      toast.success("Post deleted successfully");
    } else {
      toast.success(res.payload);
    }
  };

  useEffect(() => {
    dispatch(getUserPosts());
  }, [dispatch]);

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
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="text-4xl uppercase font-bold">
                {user?.name?.[0] || <User className="w-10 h-10" />}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-muted-foreground mb-2">@{user?.username}</p>
            {user?.bio && <p className="text-sm mb-4">{user?.bio}</p>}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground mb-4">
              {user?.createdAt && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {format(new Date(user?.createdAt), "MMMM yyyy")}
                  </span>
                </div>
              )}
              {user?.link && (
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
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-start space-x-6 text-sm">
              <div>
                <span className="font-semibold">{posts.length}</span>
                <span className="text-muted-foreground ml-1">Posts</span>
              </div>
              <div>
                <span className="font-semibold">{user?.followers.length}</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </div>
              <div>
                <span className="font-semibold">{user?.following.length}</span>
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
          <TabsList className="grid w-full grid-cols-2 gap-2">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          {/* Posts */}
          <TabsContent value="posts" className="mt-6">
            <div className="grid gap-4">
              {posts?.length ? (
                posts.map((p) => (
                  <PostCard key={p._id} post={p} onDelete={handleDeletePost} />
                ))
              ) : (
                <p>No posts to display!</p>
              )}
            </div>
          </TabsContent>

          {/* Saved Posts */}
          <TabsContent value="saved" className="mt-6">
            <div className="grid gap-4">
              {user?.savedPosts.length ? (
                user.posts.map((p) => <PostCard key={p._id} post={p} />)
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
