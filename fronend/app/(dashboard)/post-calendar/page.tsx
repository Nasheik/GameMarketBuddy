'use client';

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ScheduledPost {
  id: string;
  game_id: string;
  content: string;
  media_url: string | null;
  scheduled_time: string;
  status: string;
  platforms: string[];
  title: string;
}

export default function PostCalendar() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    platforms: [] as string[],
  });
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .order('scheduled_time', { ascending: true });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    setScheduledPosts(data || []);
  };

  const handleGridClick = (day: number) => {
    setSelectedDate(day);
    setIsModalOpen(true);
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

  const handleCreatePost = async () => {
    if (!selectedDate) return;

    const { error } = await supabase
      .from('scheduled_posts')
      .insert([
        {
          title: newPost.title,
          content: newPost.content,
          platforms: newPost.platforms,
          media_url: mediaPreview,
          media_type: mediaType,
          scheduled_time: new Date().toISOString(), // You might want to adjust this based on the selected date
          status: 'scheduled',
        }
      ]);

    if (error) {
      console.error('Error creating post:', error);
      return;
    }

    setIsModalOpen(false);
    setNewPost({ title: '', content: '', platforms: [] });
    setMediaPreview(null);
    setMediaType(null);
    fetchScheduledPosts();
  };

  return (
    <>
      <div className="h-[calc(100vh-4rem)] w-full p-2 overflow-x-hidden">
        <div className="grid grid-cols-7 gap-1 h-full">
          {/* Day headers */}
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <div key={day} className="text-center font-semibold text-xs py-1">
              {day}
            </div>
          ))}
          
          {/* Calendar grid */}
          {Array.from({ length: 35 }, (_, i) => (
            <div 
              key={i + 1}
              className="bg-white rounded-lg shadow p-1 flex flex-col cursor-pointer hover:bg-gray-50"
              onClick={() => handleGridClick(i + 1)}
            >
              {/* Top section with number and status */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold">{i + 1}</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>

              {/* Middle section for image */}
              <div className="flex-1 flex items-center justify-center my-1">
                <div className="w-full h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                  Image
                </div>
              </div>

              {/* Bottom section for caption */}
              <div className="text-[10px] text-gray-600 truncate">
                Caption text goes here
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="flex gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview Section */}
            <div className="bg-white rounded-lg p-4 w-80 h-[600px] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="space-y-4">
                {mediaPreview && (
                  <div className="rounded-lg overflow-hidden">
                    {mediaType === 'image' ? (
                      <img 
                        src={mediaPreview} 
                        alt="Preview" 
                        className="w-full h-auto rounded-lg"
                      />
                    ) : (
                      <video 
                        src={mediaPreview} 
                        controls 
                        className="w-full h-auto rounded-lg"
                      />
                    )}
                  </div>
                )}
                <div>
                  <h4 className="font-medium mb-1">{newPost.title || 'Untitled'}</h4>
                  <p className="text-sm text-gray-600">{newPost.content || 'No content yet'}</p>
                </div>
                {newPost.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newPost.platforms.map(platform => (
                      <span 
                        key={platform}
                        className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-lg p-6 w-[600px] max-h-[600px] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create Post for Day {selectedDate}</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md h-32"
                    placeholder="Enter post content"
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
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
                  <div className="flex gap-2">
                    {['Twitter', 'Discord', 'Steam'].map((platform) => (
                      <button
                        key={platform}
                        onClick={() => {
                          setNewPost({
                            ...newPost,
                            platforms: newPost.platforms.includes(platform)
                              ? newPost.platforms.filter(p => p !== platform)
                              : [...newPost.platforms, platform]
                          });
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          newPost.platforms.includes(platform)
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md"
                  >
                    Create Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
