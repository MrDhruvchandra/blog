export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  highlights: Highlight[];
}

export interface Highlight {
  id: string;
  text: string;
  comment: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  range: {
    start: number;
    end: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}