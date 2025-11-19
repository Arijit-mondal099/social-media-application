import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  TrendingUp,
  Hash,
  Users,
  Sparkles,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getExploreContent } from "@/features/post/postThunks";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultProfileImage } from "@/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import throttle from "lodash.throttle";

type User = {
  name: string;
  username: string;
  profileImage: string;
};

interface SearchResponse {
  success: boolean;
  users: User[];
}

export const ExplorePage = () => {
  const { explore, loading } = useAppSelector((state) => state.post);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchUsers, setSearchUsers] = useState<User[] | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fetchUsersBySearchQuery = useCallback(async (query: string) => {
    try {
      const { data } = await axiosInstance.get<SearchResponse>(
        `/users/search?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSearchUsers(data?.users);
      console.log(data);
    } catch (error) {
      toast.error("Failed to search user please try again later!");
      console.log(error);
    }
  }, []);

  const throttledSearch = useMemo(
    () =>
      throttle((query: string) => {
        if (query.trim() === "") {
          toast.error("Please enter a username or name to search for!");
          setSearchUsers([]);
          return;
        }

        fetchUsersBySearchQuery(query);
      }, 500),
    [fetchUsersBySearchQuery]
  );

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    throttledSearch(value);
  };

  useEffect(() => {
    dispatch(getExploreContent());
  }, [dispatch]);

  if (loading || !explore) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-12 w-full max-w-2xl" />
        </div>

        <Skeleton className="h-12 w-full mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, index) => (
            <Skeleton key={index} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-6 relative"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-6 flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <span>Explore</span>
        </h1>

        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search user by name or username..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="pl-10 h-12 text-base"
          />
        </div>
      </motion.div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="posts" className="flex items-center space-x-2">
            <Hash className="w-4 h-4" />
            <span>Posts</span>
          </TabsTrigger>
          <TabsTrigger value="people" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>People</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Trending</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {explore?.data.trendingPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/post/${post._id}`)}
              >
                {post.postType === "image" ? (
                  <img
                    src={post.image}
                    alt={`Post by ${post.creator.username}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={post.video}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="metadata"
                    />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Stats overlay */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-4 text-white text-sm font-medium">
                    <span className="flex items-center gap-1">
                      <Heart className={`w-4 h-4 ${"fill-red-500"}`} />
                      {post.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 fill-white" />
                      {post.commentCount}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="people">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {explore.data.popularUsers.map((suggestingUser, index) => (
              <motion.div
                key={suggestingUser._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-card rounded-lg p-6 text-center border hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/profile/${suggestingUser.username}`)}
              >
                <img
                  src={suggestingUser.profileImage || defaultProfileImage}
                  alt={suggestingUser.displayName}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <h3 className="font-semibold">
                    {suggestingUser.displayName}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  @{suggestingUser.username}
                </p>
                <p className="text-sm mb-4">
                  {suggestingUser.followerCount} followers
                </p>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="trending">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold mb-6">Trending Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {explore.data.trendingTopics.map((topic, index) => (
                <motion.div
                  key={topic.tag}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card rounded-lg p-6 border hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/posts/trending/${topic.tag}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">{topic.tag}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {topic.postCount} posts
                      </p>
                    </div>
                    <Badge variant="secondary">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {searchQuery.length > 0 && (
        <motion.div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 z-20 h-96 w-80 bg-white dark:bg-black shadow-2xl rounded-lg border p-3 overflow-y-auto">
          {searchUsers && searchUsers.length > 0 ? (
            searchUsers.map((u) => (
              <div
                key={u.username}
                className="flex items-center gap-4 cursor-pointer border-b py-2"
                onClick={() => navigate(`/profile/${u.username}`)}
              >
                <img
                  src={u.profileImage || defaultProfileImage}
                  alt={u.name}
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div className="flex flex-col gap-1 text-left">
                  <p className="text-sm font-semibold">{u.name}</p>
                  <p className="text-xs font-normal">@{u.username}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center text-muted-foreground text-center pt-36">
              User not found with username or name please try another
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
