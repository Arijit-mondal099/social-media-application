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
