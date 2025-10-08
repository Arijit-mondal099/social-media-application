import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  EllipsisVertical,
  Heart,
  Link as LinkIcon,
  MessageCircle,
  Share,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, formatDistanceStrict } from "date-fns";
import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { IPost, IUser } from "@/types";
import { AutoPlayVideo } from "@/components/common/AutoPlayVideo";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { deletePost, getUserPosts } from "@/features/user/userThunks";
import { toast } from "sonner";

export const PostCard: React.FC<{
  post: IPost;
  user: IUser;
}> = ({ post, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((p) => !p);
  const dispatch = useAppDispatch();

  const handleDeletePost = async (id: string) => {
    const res = await dispatch(deletePost({ id }));
    if (deletePost.fulfilled.match(res)) {
      toast.success("Post deleted successfully");
    } else {
      toast.success(res.payload)
    }
  }

  return (
    <div
      key={post._id}
      className="p-4 border rounded-lg bg-card shadow-sm space-y-4"
    >
      {/* ===== Header ===== */}
      <div className="flex items-center mb-3">
        <Avatar className="w-10 h-10 mr-3">
          <AvatarImage src={user?.profileImage} />
          <AvatarFallback className="uppercase text-sm font-bold">
            {user?.name?.[0] || <User className="w-5 h-5" />}
          </AvatarFallback>
        </Avatar>

        <div className="flex items-center justify-between w-full">
          <div>
            <p className="font-semibold text-left">{user.name}</p>
            <p className="text-left text-xs text-gray-500">{user.username}</p>
          </div>

          <Button
            variant={"ghost"}
            size={"sm"}
            className="relative"
            onClick={toggle}
          >
            <EllipsisVertical className="w-4 h-4" />

            {isOpen && (
              <div className="absolute z-20 top-6 right-8 flex flex-col gap-1 w-24 border border-gray-500 p-1 rounded-lg bg-gray-800">
                <Button className="text-xs">Edit</Button>
                <Button 
                  onClick={() => handleDeletePost(post._id)}
                  className="text-xs">Delete
                </Button>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="mb-3">
        <div className="text-left mb-3 flex items-center gap-1.5 flex-wrap text-xs">
          {post.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>

        {post.postType === "text" && (
          <p className="text-left text-sm font-medium w-full max-w-lg">
            {post.text}
          </p>
        )}

        {post.postType === "image" && (
          <div className="w-full max-w-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.text}
              className="rounded-lg w-full h-full object-contain"
            />
            {post.text && (
              <p className="text-left text-sm font-medium mt-4">{post.text}</p>
            )}
          </div>
        )}

        {post.postType === "video" && (
          <AutoPlayVideo src={post.video!} text={post.text} />
        )}
      </div>

      {/* ===== Footer ===== */}
      <div className="flex items-center justify-between gap-3 mt-3">
        <div className="flex gap-2">
          <Button
            variant={"ghost"}
            size={"sm"}
            className="flex items-center gap-2 bg-white dark:bg-black 
               border-muted hover:border-muted 
               hover:text-red-500 transition-colors duration-300"
          >
            <Heart className="w-4 h-4" />
            <span>{post.likes.length}</span>
          </Button>

          <Button
            variant={"ghost"}
            size={"sm"}
            className="flex items-center gap-2 bg-white dark:bg-black 
               border-muted hover:border-muted 
               hover:text-blue-500 transition-colors duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments.length}</span>
          </Button>

          <Button
            variant={"ghost"}
            size={"sm"}
            className="flex items-center gap-2 bg-white dark:bg-black 
               border-muted hover:border-muted 
               hover:text-blue-500 transition-colors duration-300"
          >
            <Share className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          {formatDistanceStrict(new Date(post?.createdAt), new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const { user, posts } = useAppSelector((state) => state.user);
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserPosts());
  }, [dispatch]);

  console.log(posts);

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
                posts.map((p) => <PostCard key={p._id} post={p} user={user!} />)
              ) : (
                <p>No posts to display!</p>
              )}
            </div>
          </TabsContent>

          {/* Saved Posts */}
          <TabsContent value="saved" className="mt-6">
            <div className="grid gap-4">
              {user?.savedPosts.length ? (
                user.posts.map((p) => (
                  <PostCard key={p._id} post={p} user={user} />
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
