'use client';

import { Edit2, Trash2, Clock } from 'lucide-react';
import { Post, TabType } from '../types';

interface PostListProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  drafts: Post[];
  scheduledPosts: Post[];
  handleEditPost: (post: Post) => void;
  handleDeletePost: (postId: string, isScheduled: boolean) => void;
}

export default function PostList({
  activeTab,
  setActiveTab,
  drafts,
  scheduledPosts,
  handleEditPost,
  handleDeletePost,
}: PostListProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'drafts'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Drafts ({drafts.length})
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'scheduled'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Scheduled ({scheduledPosts.length})
          </button>
        </nav>
      </div>

      <div className="p-4">
        {(activeTab === 'drafts' ? drafts : scheduledPosts).map((post) => (
          <div
            key={post.id}
            className="border rounded-lg p-4 mb-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-900">{post.title}</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(post.createdAt)}
                  </span>
                  {post.scheduledFor && (
                    <span className="flex items-center gap-1 text-xs text-blue-600">
                      <Clock className="h-3 w-3" />
                      Scheduled for {formatDate(post.scheduledFor)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{post.content}</p>
                <div className="flex items-center gap-2">
                  {post.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditPost(post)}
                  className="p-2 text-gray-500 hover:text-blue-600"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeletePost(post.id, !!post.scheduledFor)}
                  className="p-2 text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 