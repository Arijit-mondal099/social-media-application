import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      id: '2',
      username: 'alice_wonder',
      displayName: 'Alice Wonder',
      email: 'alice@example.com',
      bio: 'Adventure seeker',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150&h=150&fit=crop',
      followers: 890,
      following: 234,
      posts: 45,
      verified: false,
      createdAt: new Date('2023-02-01'),
    },
    content: 'This is absolutely stunning! 😍 The colors are incredible.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    isLiked: false,
  },
  {
    id: '2',
    author: {
      id: '3',
      username: 'photo_enthusiast',
      displayName: 'Photo Enthusiast',
      email: 'photo@example.com',
      bio: 'Photography lover',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150&h=150&fit=crop',
      followers: 1200,
      following: 456,
      posts: 78,
      verified: true,
      createdAt: new Date('2023-01-15'),
    },
    content: 'What camera did you use for this shot? The detail is amazing!',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 8,
    isLiked: true,
  },
  {
    id: '3',
    author: {
      id: '4',
      username: 'travel_buddy',
      displayName: 'Travel Buddy',
      email: 'travel@example.com',
      bio: 'World explorer',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop',
      followers: 567,
      following: 123,
      posts: 234,
      verified: false,
      createdAt: new Date('2023-03-01'),
    },
    content: 'Adding this to my travel bucket list! 🌍',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 5,
    isLiked: false,
  },
];

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  onAddComment,
  onLikeComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const { user } = useAuth();

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: user!,
      content: newComment,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
    };

    setComments(prev => [comment, ...prev]);
    onAddComment(postId, newComment);
    setNewComment('');
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
    onLikeComment(commentId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-border mt-4 pt-4"
    >
      {/* Add Comment */}
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex items-center space-x-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <ScrollArea className="max-h-96">
        <AnimatePresence>
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 py-3 border-b border-border/50 last:border-b-0"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback>{comment.author.displayName[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-sm">{comment.author.displayName}</span>
                  <span className="text-xs text-muted-foreground">@{comment.author.username}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                  </span>
                </div>
                
                <p className="text-sm mb-2">{comment.content}</p>
                
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-red-500"
                  >
                    <Heart
                      className={`w-3 h-3 ${
                        comment.isLiked ? 'text-red-500 fill-current' : ''
                      }`}
                    />
                    <span>{comment.likes}</span>
                  </motion.button>
                  
                  <button className="text-xs text-muted-foreground hover:text-foreground">
                    Reply
                  </button>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="p-1">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
};