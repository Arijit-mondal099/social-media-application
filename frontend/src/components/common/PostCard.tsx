import React from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface PostCardProps {
  post: IPost;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
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
                  <AvatarImage src={""} />
                  <AvatarFallback>{"A"}</AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <div className="w-full flex items-center space-x-1">
                  <span className="font-semibold text-sm">
                    {"arijit mondal"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>@{"arijit717"}</span>
                  {formatDistanceStrict(new Date(post?.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {post.postType === "text" && (
            <p className="w-full max-w-lg text-left">{post.text}</p>
          )}

          {post.postType === "image" && (
            <div className="w-full h-[70vh] max-w-lg space-y-2 pb-6">
              <img
                src={post.image}
                alt={post._id}
                className="w-full h-full rounded-lg"
              />
              <p className="text-left text-sm font-medium">{post.text}</p>
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
                className="flex items-center gap-2 bg-white dark:bg-black 
               border-muted hover:border-muted 
               hover:text-red-500 transition-colors duration-300"
              >
                <Heart className="w-4 h-4" />
                <span>{post.likes.length ? post.likes.length : "Like"}</span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white dark:bg-black 
               border-muted hover:border-muted 
               hover:text-blue-500 transition-colors duration-300"
              >
                <MessageCircle className="w-4 h-4" />
                <span>14</span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white dark:bg-black 
               border-muted hover:border-muted 
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
