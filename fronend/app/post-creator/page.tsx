'use client';

import { useState } from 'react';
import { Post, PostType, TabType } from './types';
import PostForm from './components/PostForm';
import PreviewSection from './components/PreviewSection';
import PostList from './components/PostList';

export default function PostCreator() {
  const [postType, setPostType] = useState<PostType>('short-form');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [announcementType, setAnnouncementType] = useState('Game Update');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('drafts');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showPreviews, setShowPreviews] = useState(false);

  // Mock data for drafts and scheduled posts
  const [drafts, setDrafts] = useState<Post[]>([
    {
      id: '1',
      type: 'short-form',
      title: 'Game Update Coming Soon',
      content: 'Exciting new features coming in the next update!',
      platforms: ['Twitter', 'Discord'],
      createdAt: '2024-04-01T10:00:00Z'
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Spring Sale',
      content: 'Get 50% off all DLCs this weekend!',
      platforms: ['Twitter', 'Steam'],
      createdAt: '2024-04-02T15:30:00Z'
    }
  ]);

  const [scheduledPosts, setScheduledPosts] = useState<Post[]>([
    {
      id: '3',
      type: 'announcement',
      title: 'Server Maintenance',
      content: 'We will be performing maintenance on our servers tomorrow.',
      platforms: ['Discord', 'Steam'],
      scheduledFor: '2024-04-05T02:00:00Z',
      createdAt: '2024-04-01T09:00:00Z'
    }
  ]);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setPostType(post.type);
    setTitle(post.title);
    setContent(post.content);
    if (post.mediaUrl) {
      setMediaPreview(post.mediaUrl);
      setMediaType(post.mediaType || null);
    }
    setSelectedPlatforms(post.platforms);
    if (post.scheduledFor) {
      setIsScheduled(true);
      setScheduleDateTime(post.scheduledFor);
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePost = (postId: string, isScheduled: boolean) => {
    if (isScheduled) {
      setScheduledPosts(scheduledPosts.filter(post => post.id !== postId));
    } else {
      setDrafts(drafts.filter(post => post.id !== postId));
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (isImage || isVideo) {
        setMediaType(isImage ? 'image' : 'video');
        const url = URL.createObjectURL(file);
        setMediaPreview(url);
      }
    }
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Post Creator</h1>
      
      <div className="relative">
        {/* Post Creation Form */}
        <div className={`bg-white p-6 rounded-lg shadow transition-all duration-300 ${
          showPreviews ? 'w-[calc(100%-42.33%)]' : 'w-[calc(100%-10%)]'
        }`}>
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <PostForm
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            mediaPreview={mediaPreview}
            mediaType={mediaType}
            handleMediaChange={handleMediaChange}
            isScheduled={isScheduled}
            setIsScheduled={setIsScheduled}
            scheduleDateTime={scheduleDateTime}
            setScheduleDateTime={setScheduleDateTime}
            selectedPlatforms={selectedPlatforms}
            handlePlatformChange={handlePlatformChange}
          />
        </div>

        <PreviewSection
          showPreviews={showPreviews}
          setShowPreviews={setShowPreviews}
          selectedPlatforms={selectedPlatforms}
          title={title}
          content={content}
          mediaPreview={mediaPreview}
          mediaType={mediaType}
          postType={postType}
          announcementType={announcementType}
          discountCode={discountCode}
          validUntil={validUntil}
        />
      </div>

      {/* <PostList
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        drafts={drafts}
        scheduledPosts={scheduledPosts}
        handleEditPost={handleEditPost}
        handleDeletePost={handleDeletePost}
      /> */}
    </div>
  );
} 