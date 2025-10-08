import React from "react";
import { motion } from "framer-motion";
import { PostCard } from "@/components/common/PostCard";
import { IPost } from "@/types";

export interface IComment {
  _id: string;
  user: string;
  text: string;
  createdAt: string;
}

export const FeedPage: React.FC = () => {
  const posts: IPost[] = [
    {
      _id: "1",
      postType: "text",
      text: "Just finished reading an amazing book! Highly recommend it.",
      createdBy: "user1",
      likes: ["user2", "user3"],
      comments: [],
      tags: ["reading", "books", "recommendation"],
      createdAt: new Date("2025-09-20T10:00:00"),
    },
    {
      _id: "2",
      postType: "image",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrTPjHOG0LBJKLlx35kYcK4hpx5xRdGNQ4tQ&s",
      text: "Look at this beautiful sunset!",
      createdBy: "user2",
      likes: ["user1"],
      comments: [],
      tags: ["sunset", "photography", "nature"],
      createdAt: new Date("2025-09-21T18:30:00"),
    },
    {
      _id: "3",
      postType: "video",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      text: "Check out this cool video I made!",
      createdBy: "user3",
      likes: [],
      comments: [],
      tags: ["video", "fun", "editing"],
      createdAt: new Date("2025-09-19T14:15:00"),
    },
    {
      _id: "4",
      postType: "text",
      text: "Excited to start my new project at work today!",
      createdBy: "user4",
      likes: ["user1", "user3"],
      comments: [],
      tags: ["work", "project", "motivation"],
      createdAt: new Date("2025-09-21T08:45:00"),
    },
    {
      _id: "5",
      postType: "image",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrTPjHOG0LBJKLlx35kYcK4hpx5xRdGNQ4tQ&s",
      text: "My lunch today was amazing 🍝",
      createdBy: "user5",
      likes: ["user2"],
      comments: [],
      tags: ["food", "lunch", "yum"],
      createdAt: new Date("2025-09-21T13:20:00"),
    },
  ];

  const toggleLike = (postId: string) => {
    console.log("Liked post", postId);
  };

  const toggleBookmark = (postId: string) => {
    console.log("Bookmarked post", postId);
  };

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

      {posts.map((post, index) => (
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
