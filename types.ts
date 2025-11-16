
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

export interface Post {
  id: string;
  user: User;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  comments: Comment[];
}
