import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Calendar, Clock, User } from 'lucide-react';

const Home: React.FC = () => {
  const posts = useStore((state) => state.posts);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest Posts</h1>

      {(!posts || posts.length === 0) ? (
        <div className="text-center">
          <p className="text-gray-600">No posts available. Check back later!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post._id} // Using _id for MongoDB compatibility
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link to={`/post/${post._id}`} className="block p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
                <p
                  className="prose prose-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    // Safely truncate content to avoid rendering unwanted HTML
                    __html: `${post.content.replace(/<[^>]+>/g, '').substring(0, 200)}...`,
                  }}
                />
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{post.authorName || 'Unknown Author'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(post.updatedAt).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
