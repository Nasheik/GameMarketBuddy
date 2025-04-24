'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Post {
  postType: string;
  platform: string;
  content: string;
  hashtags: string[];
  scheduledTime?: string;  // User's selected time in local format
  timeToPost?: string;     // UTC time from database
  imageUrl?: string;
  status?: 'draft' | 'scheduled' | 'published' | 'failed' | 'posted';
}

export default function PostWeek() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { selectedGame } = useGame();
  const supabase = createClient();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  // Function to get dates for the current week
  const getWeekDates = () => {
    const today = new Date();
    const weekDates = [];
    
    // Start from today and get the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      weekDates.push({
        day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()],
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0]
      });
    }
    return weekDates;
  };

  const weekDates = getWeekDates();

  useEffect(() => {
    if (selectedGame) {
      fetchSavedPosts();
    }
  }, [selectedGame]);

  const fetchSavedPosts = async () => {
    if (!selectedGame) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: savedPosts } = await supabase
        .from('saved_posts')
        .select('*')
        .eq('game_id', selectedGame.id)
        .order('time_to_post');

      if (savedPosts) {
        const formattedPosts = savedPosts.map(post => {
          // Convert UTC time to local time for the time input
          let localTime;
          if (post.time_to_post) {
            const utcDate = new Date(post.time_to_post);
            // Get the local time components
            const hours = String(utcDate.getHours()).padStart(2, '0');
            const minutes = String(utcDate.getMinutes()).padStart(2, '0');
            // Format as HH:MM for time input
            localTime = `${hours}:${minutes}`;
          }
          
          return {
            postType: post.post_type,
            platform: post.platform,
            content: post.content,
            hashtags: post.hashtags,
            scheduledTime: localTime,
            timeToPost: post.time_to_post,
            status: post.status,
            imageUrl: post.media_url
          };
        });
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedGame) return;
    
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameDetails: selectedGame }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate posts');
      }

      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Error generating posts:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < weekDates.length - 3) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePostClick = (date: string) => {
    const post = posts.find(p => {
      if (!p.timeToPost) return false;
      const postDate = new Date(p.timeToPost).toISOString().split('T')[0];
      return postDate === date;
    });
    if (post) {
      setSelectedPost(post);
      setIsEditModalOpen(true);
    }
  };

  const handleSavePost = async () => {
    if (!selectedPost || !selectedGame) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('saved_posts')
        .update({
          post_type: selectedPost.postType,
          platform: selectedPost.platform,
          content: selectedPost.content,
          hashtags: selectedPost.hashtags,
          time_to_post: new Date(selectedPost.scheduledTime || '').toISOString(),
          media_url: selectedPost.imageUrl,
          media_type: selectedPost.imageUrl ? 'image' : null
        })
        .eq('game_id', selectedGame.id)
        .eq('time_to_post', selectedPost.timeToPost);

      if (error) throw error;

      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.timeToPost === selectedPost.timeToPost ? selectedPost : post
        )
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedPost || !selectedGame) return;
    
    setUploadingImage(true);
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedGame.id}-${selectedPost.timeToPost}-${Date.now()}.${fileExt}`;
      const filePath = `post-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      setSelectedPost({ ...selectedPost, imageUrl: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    if (!selectedPost) return;
    setSelectedPost({ ...selectedPost, imageUrl: undefined });
  };

  const handleSchedule = async () => {
    if (!selectedPost || !selectedGame) return;

    // Validate scheduled time is at least 5 minutes in the future
    if (selectedPost.scheduledTime) {
      const [hours, minutes] = selectedPost.scheduledTime.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      const now = new Date();
      const oneMinuteFromNow = new Date(now.getTime() + 1 * 60000); // Add 1 minute

      if (scheduledTime < oneMinuteFromNow) {
        alert('Scheduled time must be at least 1 minutes in the future');
        return;
      }
    }

    setScheduling(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newStatus = selectedPost.status === 'scheduled' ? 'draft' : 'scheduled';
      
      // Convert local time to UTC before saving
      let utcDateTime = null;
      if (selectedPost.scheduledTime) {
        const [hours, minutes] = selectedPost.scheduledTime.split(':').map(Number);
        const localDateTime = new Date();
        localDateTime.setHours(hours, minutes, 0, 0);
        utcDateTime = localDateTime.toISOString();
      }
      
      // Update both post content and scheduling status in a single operation
      const updateData = {
        post_type: selectedPost.postType,
        platform: selectedPost.platform,
        content: selectedPost.content,
        hashtags: selectedPost.hashtags,
        status: newStatus,
        ...(newStatus === 'scheduled' ? {
          time_to_post: utcDateTime,
          media_url: selectedPost.imageUrl,
          media_type: selectedPost.imageUrl ? 'image' : null
        } : {})
      };

      const { error } = await supabase
        .from('saved_posts')
        .update(updateData)
        .eq('game_id', selectedGame.id)
        .eq('time_to_post', selectedPost.timeToPost);

      if (error) throw error;

      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.timeToPost === selectedPost.timeToPost ? { ...selectedPost, status: newStatus } : post
        )
      );
      setSelectedPost({ ...selectedPost, status: newStatus });
    } catch (error) {
      console.error('Error updating post status:', error);
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-800">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!selectedGame) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No game selected. Please select a game from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="h-[calc(100vh-64px)] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Post Week</h1>
          <Button 
            onClick={handleGenerate} 
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate New Posts'
            )}
          </Button>
        </div>

        <div className="flex flex-col flex-grow">
          <div className="flex justify-center items-center mb-4 gap-10">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            >
              ← Previous
            </Button>
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              Showing: {weekDates[currentIndex]?.date} - {weekDates[currentIndex + 2]?.date}
            </div>
            <Button
              onClick={handleNext}
              disabled={currentIndex >= weekDates.length - 3}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            >
              Next →
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
            {weekDates.slice(currentIndex, currentIndex + 3).map(({ day, date, fullDate }, index) => {
              const post = posts.find(p => {
                if (!p.timeToPost) return false;
                const postDate = new Date(p.timeToPost).toISOString().split('T')[0];
                return postDate === fullDate;
              });
              return (
                <div key={fullDate} className={`flex flex-col relative h-full ${index < 2 ? 'after:content-[""] after:absolute after:right-[-8px] after:top-0 after:h-full after:w-[1px] after:bg-gray-300 dark:after:bg-gray-700' : ''}`}>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-t-lg">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{day}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{date}</p>
                  </div>
                  <div className="flex-grow p-4">
                    <Card 
                      className={`p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 ${
                        post?.status === 'scheduled' ? 'border-green-500 dark:border-green-600' : ''
                      }`}
                      onClick={() => handlePostClick(fullDate)}
                    >
                      {post ? (
                        <>
                          <div className="mb-3">
                            <span className="font-medium text-gray-900 dark:text-white">Type:</span> 
                            <span className="text-gray-700 dark:text-gray-300"> {post.postType}</span>
                          </div>
                          <div className="mb-3">
                            <span className="font-medium text-gray-900 dark:text-white">Platform:</span> 
                            <span className="text-gray-700 dark:text-gray-300"> {post.platform}</span>
                          </div>
                          <div className="mb-3">
                            <span className="font-medium text-gray-900 dark:text-white">Content:</span>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{post.content}</p>
                          </div>
                          <div className="mb-3">
                            <span className="font-medium text-gray-900 dark:text-white">Hashtags:</span>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {post.hashtags.map((tag, index) => (
                                <span key={index} className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-sm text-gray-700 dark:text-gray-300">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          {post.status === 'scheduled' && (
                            <div className="text-green-600 dark:text-green-400 font-medium">
                              Scheduled for {post.scheduledTime}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400 italic">
                          No post generated for this day
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className={`max-w-4xl bg-white dark:bg-gray-800 border-8 rounded-2xl shadow-xl ${
          selectedPost?.status === 'scheduled' 
            ? 'border-blue-500 dark:border-blue-600' 
            : selectedPost?.status === 'published'
            ? 'border-green-500 dark:border-green-600'
            : selectedPost?.status === 'failed'
            ? 'border-red-500 dark:border-red-600'
            : 'border-yellow-500 dark:border-yellow-600'
        }`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Post for {selectedPost?.timeToPost ? new Date(selectedPost.timeToPost).toLocaleDateString() : ''}
            </DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="grid grid-cols-2 gap-6 py-4">
              {/* Left Column - Image Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Post Image
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3">
                    {selectedPost.imageUrl ? (
                      <div className="relative">
                        <img 
                          src={selectedPost.imageUrl} 
                          alt="Post preview" 
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40">
                        <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400 mb-2 text-xs text-center">
                          Drag and drop an image here, or click to select
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          disabled={uploadingImage}
                          size="sm"
                          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {uploadingImage ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Select Image'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Recommended Media
                  </Label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Suggested images/videos for this post:
                      </p>
                      <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-600 dark:text-gray-300">
                        <li>Gameplay screenshot showing [specific feature]</li>
                        <li>Character close-up with [specific emotion]</li>
                        <li>Action sequence from [specific level]</li>
                        <li>Behind-the-scenes development clip</li>
                        <li>Community highlight reel</li>
                      </ul>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Tip: Use high-quality images (1920x1080) and keep videos under 60 seconds for best engagement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Main Content */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="postType" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </Label>
                  <Input
                    id="postType"
                    value={selectedPost.postType}
                    onChange={(e) => setSelectedPost({...selectedPost, postType: e.target.value})}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={selectedPost.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSelectedPost({...selectedPost, content: e.target.value})}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hashtags" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Hashtags
                  </Label>
                  <Input
                    id="hashtags"
                    value={selectedPost.hashtags.join(', ')}
                    onChange={(e) => setSelectedPost({...selectedPost, hashtags: e.target.value.split(',').map(tag => tag.trim())})}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-9"
                    placeholder="Enter hashtags separated by commas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduledTime" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Scheduled Time
                  </Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={selectedPost.scheduledTime || ''}
                    onChange={(e) => setSelectedPost({...selectedPost, scheduledTime: e.target.value})}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-9"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSchedule}
                    disabled={scheduling || selectedPost?.status === 'published'}
                    className={`${
                      selectedPost?.status === 'scheduled' 
                        ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white' 
                        : selectedPost?.status === 'published'
                        ? 'bg-gray-600 text-white cursor-not-allowed'
                        : selectedPost?.status === 'failed'
                        ? 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
                    }`}
                  >
                    {scheduling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {selectedPost?.status === 'scheduled' ? 'Unscheduling...' : 'Scheduling...'}
                      </>
                    ) : selectedPost?.status === 'scheduled' ? (
                      'Unschedule Post'
                    ) : selectedPost?.status === 'published' ? (
                      'Published'
                    ) : selectedPost?.status === 'failed' ? (
                      'Reschedule'
                    ) : (
                      'Schedule Post'
                    )}
                  </Button>
                  {selectedPost?.status !== 'published' && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditModalOpen(false)}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSavePost}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                      >
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 