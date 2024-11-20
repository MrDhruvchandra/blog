import { create } from 'zustand';
import { Post, User } from '../types';
 
 
 

interface Store {
  posts: Post[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => Promise<void>;
  updatePost: (post: Post) => Promise<void>;
  deletePost: (postId: string, authorId: string) => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  fetchPosts: () => Promise<void>;
  fetchPost: (id: string) => Promise<Post | null>;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const useStore = create<Store>((set, get) => ({
  posts: [],
  currentUser: null,
  loading: false,
  error: null,

  setPosts: (posts) => set({ posts }),
  setCurrentUser: (user) => set({ currentUser: user }),

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const posts = await response.json();
      set({ posts, loading: false });
    } catch (error: any) {
      console.error(error);
      set({ error: error.message || 'An unexpected error occurred', loading: false });
    }
  },

  fetchPost: async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`); // Adjust the API endpoint if necessary
      const post = await response.json();
      return post;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  addPost: async (post) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      if (!response.ok) throw new Error('Failed to create post');
      const newPost = await response.json();
      set((state) => ({ posts: [newPost, ...state.posts], loading: false }));
    } catch (error: any) {
      console.error(error);
      set({ error: error.message || 'Failed to create post', loading: false });
    }
  },

  updatePost: async (post) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/posts/${post._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      if (!response.ok) throw new Error('Failed to update post');
      const updatedPost = await response.json();
      set((state) => ({
        posts: state.posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)),
        loading: false,
      }));
    } catch (error: any) {
      console.error(error);
      set({ error: error.message || 'Failed to update post', loading: false });
    }
  },

  deletePost: async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
      });
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== id),
      }));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  },
}));
