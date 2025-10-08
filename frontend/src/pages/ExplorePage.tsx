import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Hash, Users, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const trendingTopics = [
    { tag: 'photography', posts: '12.5K posts' },
    { tag: 'design', posts: '8.3K posts' },
    { tag: 'travel', posts: '15.7K posts' },
    { tag: 'food', posts: '9.2K posts' },
    { tag: 'art', posts: '11.1K posts' },
  ];

  const exploreImages = [
    'https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?w=400&h=400&fit=crop',
  ];

  const suggestedUsers = [
    {
      id: '1',
      username: 'alex_photographer',
      displayName: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?w=150&h=150&fit=crop',
      followers: '12.5K',
      verified: true,
    },
    {
      id: '2',
      username: 'maria_designs',
      displayName: 'Maria Rodriguez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150&h=150&fit=crop',
      followers: '8.9K',
      verified: false,
    },
    {
      id: '3',
      username: 'david_travel',
      displayName: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150&h=150&fit=crop',
      followers: '15.2K',
      verified: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-6"
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
            placeholder="Search for posts, users, or hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {exploreImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              >
                <img
                  src={image}
                  alt={`Explore post ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-2 text-white text-sm">
                    <span>❤️ 234</span>
                    <span>💬 12</span>
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
            {suggestedUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-card rounded-lg p-6 text-center border hover:shadow-lg transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <h3 className="font-semibold">{user.displayName}</h3>
                  {user.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-2">@{user.username}</p>
                <p className="text-sm mb-4">{user.followers} followers</p>
                <Button size="sm" className="w-full">
                  Follow
                </Button>
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
            <h2 className="text-xl font-semibold mb-6">Trending Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingTopics.map((topic, index) => (
                <motion.div
                  key={topic.tag}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card rounded-lg p-6 border hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">{topic.tag}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm">{topic.posts}</p>
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
    </motion.div>
  );
};