'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';


interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  scheduledFor?: string;
  status: string;
  platform: string;
  queuePosition?: number;
}

export function Queue() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-500">Loading queue...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-500">No posts in queue</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-gray-500">
              {post.platform}
            </span>
            <span className={`text-sm px-2 py-1 rounded ${
              post.status === 'queued' ? 'bg-blue-100 text-blue-800' :
              post.status === 'published' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {post.status}
            </span>
          </div>
          
          <p className="text-gray-900 mb-2">{post.content}</p>
          
          {post.mediaUrl && (
            <div className="mb-2">
              {post.mediaType === 'image' ? (
                <img
                  src={post.mediaUrl}
                  alt="Post media"
                  className="max-w-full h-auto rounded"
                />
              ) : (
                <video
                  src={post.mediaUrl}
                  controls
                  className="max-w-full h-auto rounded"
                />
              )}
            </div>
          )}
          
          {post.scheduledFor && (
            <div className="text-sm text-gray-500">
              Scheduled for: {format(new Date(post.scheduledFor), 'PPP p')}
            </div>
          )}
          
          {post.queuePosition !== undefined && (
            <div className="text-sm text-gray-500 mt-2">
              Queue position: {post.queuePosition}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 