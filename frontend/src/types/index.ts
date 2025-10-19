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
  comments: [];
  tags: string[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  author: IUser;
  content: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
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

export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
