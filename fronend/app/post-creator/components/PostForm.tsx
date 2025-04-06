'use client';

import { PostFormProps } from '../types';

export default function PostForm({
  title,
  setTitle,
  content,
  setContent,
  mediaPreview,
  mediaType,
  handleMediaChange,
  isScheduled,
  setIsScheduled,
  scheduleDateTime,
  setScheduleDateTime,
  selectedPlatforms,
  handlePlatformChange,
}: PostFormProps) {
  return (
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              className="rounded"
              checked={selectedPlatforms.includes('Twitter')}
              onChange={() => handlePlatformChange('Twitter')}
            />
            <span className="ml-2">Twitter</span>
          </label>
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              className="rounded"
              checked={selectedPlatforms.includes('Discord')}
              onChange={() => handlePlatformChange('Discord')}
            />
            <span className="ml-2">Discord</span>
          </label>
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              className="rounded"
              checked={selectedPlatforms.includes('Steam')}
              onChange={() => handlePlatformChange('Steam')}
            />
            <span className="ml-2">Steam</span>
          </label>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Post Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content..."
        />
      </div>

      {/* Media Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Media</label>
        <div className="flex items-center gap-4">
          <label className="flex-1">
            <div className="w-full px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50 text-center">
              <span className="text-blue-600">Upload Media</span>
              <p className="text-xs text-gray-500 mt-1">Supports images and videos</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleMediaChange}
            />
          </label>
          {mediaPreview && (
            <div className="flex-1">
              {mediaType === 'image' ? (
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  className="max-h-32 w-auto rounded-md"
                />
              ) : (
                <video 
                  src={mediaPreview} 
                  controls 
                  className="max-h-32 w-auto rounded-md"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scheduling Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">Schedule Post</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {isScheduled && (
          <div className="mt-2">
            <input
              type="datetime-local"
              className="w-1/4 px-3 py-2 border rounded-md"
              value={scheduleDateTime}
              onChange={(e) => setScheduleDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Posts will be published at the scheduled time across all selected platforms
            </p>
          </div>
        )}
      </div>

      

      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
          {isScheduled ? 'Schedule Post' : 'Create Draft'}
        </button>
      </div>
    </div>
  );
} 