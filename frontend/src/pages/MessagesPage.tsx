import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, MoreVertical, Phone, Video, Smile } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

export const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');

  const conversations = [
    {
      id: '1',
      user: {
        name: 'Sarah Wilson',
        username: 'sarah_wilson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop',
      },
      lastMessage: 'That sounds great! When do you want to meet?',
      time: '2m',
      unread: 2,
      online: true,
    },
    {
      id: '2',
      user: {
        name: 'Mike Chen',
        username: 'mike_design',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150&h=150&fit=crop',
      },
      lastMessage: 'Thanks for sharing that design inspiration!',
      time: '1h',
      unread: 0,
      online: true,
    },
    {
      id: '3',
      user: {
        name: 'Emma Rodriguez',
        username: 'emma_art',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150&h=150&fit=crop',
      },
      lastMessage: 'Looking forward to collaborating on this project',
      time: '3h',
      unread: 0,
      online: false,
    },
  ];

  const messages = [
    {
      id: '1',
      content: 'Hey! How are you doing?',
      sender: 'other',
      time: '10:30 AM',
    },
    {
      id: '2',
      content: 'I\'m doing great! Just finished working on a new project. How about you?',
      sender: 'me',
      time: '10:32 AM',
    },
    {
      id: '3',
      content: 'That sounds amazing! I\'d love to see it when you\'re ready to share.',
      sender: 'other',
      time: '10:35 AM',
    },
    {
      id: '4',
      content: 'Of course! I\'ll send you some screenshots later today.',
      sender: 'me',
      time: '10:37 AM',
    },
    {
      id: '5',
      content: 'That sounds great! When do you want to meet?',
      sender: 'other',
      time: '10:45 AM',
    },
  ];

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    // Handle sending message
    setMessageInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-6 h-screen"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-6"
      >
        Messages
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-5/6">
        {/* Conversations List */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border overflow-hidden"
        >
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="h-full">
            <div className="p-2">
              {conversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                    selectedChat === conversation.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.user.avatar} />
                        <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">
                          {conversation.user.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {conversation.time}
                          </span>
                          {conversation.unread > 0 && (
                            <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                              {conversation.unread}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>

        {/* Chat Window */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card rounded-lg border flex flex-col"
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedConversation.user.avatar} />
                      <AvatarFallback>{selectedConversation.user.name[0]}</AvatarFallback>
                    </Avatar>
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedConversation.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.sender === 'me'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'me' 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};