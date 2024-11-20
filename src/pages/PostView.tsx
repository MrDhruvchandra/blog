import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useStore } from '../store/useStore';
import { Edit, Trash2, MessageSquare } from 'lucide-react';

const PostView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { posts, deletePost, fetchPost } = useStore(); // Using fetchPost instead of fetchPostById
  const [post, setPost] = useState<any>(null);
  const [selectedText, setSelectedText] = useState('');
  const [showHighlightPopup, setShowHighlightPopup] = useState(false);
  const [comment, setComment] = useState('');
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadPost = async () => {
      let existingPost = posts.find((p) => p._id === id);
      if (!existingPost) {
        existingPost = await fetchPost(id!); // Fetching post with fetchPost instead of fetchPostById
      }
      setPost(existingPost);
    };

    loadPost();
  }, [id, posts, fetchPost]);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(selection.toString());
        setPopupPosition({
          x: rect.left + rect.width / 2,
          y: window.scrollY + rect.top - 10,
        });
        setShowHighlightPopup(true);
      } else {
        setShowHighlightPopup(false);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(post._id);
      navigate('/');
    }
  };

  const handleHighlight = async () => {
    try {
      const updatedPost = {
        ...post,
        highlights: [...(post.highlights || []), { text: selectedText, comment }],
      };

      // Add logic to update the post via API if needed
      setPost(updatedPost);
      setShowHighlightPopup(false);
      setComment('');
    } catch (error) {
      console.error('Failed to add highlight:', error);
    }
  };

  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
        {user?.sub === post.authorId && (
          <div className="flex space-x-4">
            <Link
              to={`/edit/${post._id}`}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h2 className="text-lg font-semibold">{post.authorName}</h2>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {showHighlightPopup && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg p-4 transform -translate-x-1/2 -translate-y-full"
          style={{ left: popupPosition.x, top: popupPosition.y }}
        >
          <textarea
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
          />
          <button
            onClick={handleHighlight}
            className="flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Add Highlight
          </button>
        </div>
      )}
    </div>
  );
};

export default PostView;
