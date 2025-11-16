
export interface User {
  name: string;
  avatarUrl: string;
}

export interface Story {
  id: string;
  user: User;
  imageUrl: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export interface Media {
  type: 'image' | 'video';
  url: string;
}

export interface Post {
  id: string;
  user: User;
  timestamp: string;
  content: string;
  media?: Media[];
  likes: number;
  commentsCount: number;
  comments: Comment[];
}

export interface Notification {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  read: boolean;
  postContent?: string;
}

export interface ChatMessage {
    id: string;
    text: string;
    timestamp: string;
    sender: 'me' | 'other';
}

export interface Conversation {
    id: string;
    user: User;
    messages: ChatMessage[];
    unreadCount: number;
}

export interface Fanpage {
    id: string;
    name: string;
    category: string;
    avatarUrl: string;
    coverUrl: string;
    bio: string;
    ownerEmail: string;
}