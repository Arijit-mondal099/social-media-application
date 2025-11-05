export interface IAuth {
  name?: string;
  email: string;
  username?: string;
  password: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: IUser;
}

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  followers: string[];
  following: string[];
  posts: IPost[];
  link: string;
  savedPosts: IPost[];
  createdAt: Date;
}

export interface IComment {
  comUserId: {
    _id: string;
    name: string;
    username: string;
    profileImage?: string;
  };
  comment: string;
  createdAt: Date;
}

export interface IPost {
  _id: string;
  postType: "text" | "image" | "video";
  video?: string;
  image?: string;
  text: string;
  createdBy: {
    username: string;
    profileImage?: string;
    name: string;
  };
  likes: string[];
  comments: IComment[];
  tags: string[];
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: IUser[];
  lastMessage: Message;
  unreadCount: number;
}

export interface IExplore {
  data: {
    trendingTopics: Array<{ tag: string; postCount: number }>;
    trendingPosts: Array<{
      _id: string;
      postType: string;
      text: string;
      image: string;
      video: string;
      tags: string[];
      createdAt: Date;
      likeCount: number;
      commentCount: number;
      engagementScore: number;
      creator: {
        _id: string;
        username: string;
        displayName: string;
        profileImage: string;
      };
    }>;
    popularUsers: Array<{
      _id: string;
      username: string;
      profileImage: string;
      bio: string;
      followerCount: number;
      displayName: string;
      isFollowedByUser: boolean;
    }>;
  };
  timestamp: Date;
}
