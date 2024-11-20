import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useStore } from '../store/useStore';
import { Save, X } from 'lucide-react';

const Editor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { posts, addPost, updatePost } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (id) {
      const post = posts.find((p) => p._id === id);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
      } else {
        console.error('Post not found');
        navigate('/');
      }
    }
  }, [id, posts, isAuthenticated, navigate]);

  const handleSave = () => {
    if (!user) return;
    if (!title.trim() || !content.trim()) {
      alert('Title and content cannot be empty!');
      return;
    }

    const post = {
      _id: id || (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
      title,
      content,
      authorId: user.sub!,
      authorName: user.name!,
      authorAvatar: user.picture!,
      createdAt: id ? posts.find((p) => p._id === id)?.createdAt! : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      highlights: id ? posts.find((p) => p._id === id)?.highlights! : [],
    };

    if (id) {
      updatePost(post);
    } else {
      addPost(post);
    }

    navigate(`/post/${post._id}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
          className="text-3xl font-bold focus:outline-none w-full border-b border-gray-300 pb-2 mb-4"
        />
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
        </div>
      </div>

      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        className="h-[calc(100vh-250px)] mb-12"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        }}
      />
    </div>
  );
};

export default Editor;
