

export type FriendshipStatus = 'loading' | 'friends' | 'pending_sent' | 'pending_received' | 'not_friends';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  is_active?: boolean;
}

export interface Group {
  id:string;
  name: string;
  description: string;
  memberCount: number;
  coverUrl: string;
  avatarUrl: string;
  isPrivate: boolean;
}

export interface Product {
  id: string;
  name:string;
  price: string;
  imageUrl: string;
  seller: User;
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
  type?: 'standard' | 'report';
  format?: 'post' | 'reel';
  group?: { id: string; name: string };
  fanpage?: { id: string; name: string; avatarUrl: string; };
  isLikedByCurrentUser?: boolean;
}

export interface AppNotification {
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
    ownerId: string;
    ownerEmail?: string;
    is_active?: boolean;
}

export interface AppEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  coverUrl: string;
  organizer: User | Fanpage;
  attendees: number;
  creationDate: string;
}