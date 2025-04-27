'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X, Twitter, Music } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Post {
  title: string;
  platform: string;
  content: string;
  hashtags: string[];
  localDate?: string;  // User's selected time in local format
  timeToPost?: string;     // Combined date and time from database
  scheduledTime?: string;  // Time in HH:mm format
  imageUrl?: string;
  mediaSuggestion?: string;  // Media suggestion from database
  status?: 'draft' | 'scheduled' | 'published' | 'failed';
}

export default function PostWeek() {
  const router = useRouter();
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
  const [originalScheduledTime, setOriginalScheduledTime] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }
      if (selectedGame) {
        fetchSavedPosts();
      }
    };
    checkAuth();
  }, [selectedGame]);

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

  const fetchSavedPosts = async () => {
    if (!selectedGame) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: savedPosts } = await supabase
        .from('saved_posts')
        .select('*')
        .eq('game_id', selectedGame.id)
        .order('local_date');

      if (savedPosts) {
        const formattedPosts = savedPosts.map(post => {
          // Convert UTC time_to_post to local time for the scheduled time input
          let scheduledTime;
          if (post.time_to_post) {
            const date = new Date(post.time_to_post);
            scheduledTime = date.toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            });
          }
          
          return {
            title: post.title,
            platform: post.platform,
            content: post.content,
            hashtags: post.hashtags,
            localDate: post.local_date,
            timeToPost: post.time_to_post,
            scheduledTime: scheduledTime,
            status: post.status,
            imageUrl: post.media_url,
            mediaSuggestion: post.media_suggestion
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
      if (!p.localDate) return false;
      const postDate = p.localDate;
      return postDate === date;
    });
    if (post) {
      setSelectedPost(post);
      setOriginalScheduledTime(post.scheduledTime || null);
      setIsEditModalOpen(true);
    }
  };

  const handleSavePost = async () => {
    if (!selectedPost || !selectedGame) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Convert local time to UTC
      let timeToPost = null;
      if (selectedPost.scheduledTime && selectedPost.localDate) {
        // Combine local date and time
        const [year, month, day] = selectedPost.localDate.split('-').map(Number);
        const [hours, minutes] = selectedPost.scheduledTime.split(':').map(Number);
        
        // Create a date object in local timezone
        const localDateTime = new Date(year, month - 1, day, hours, minutes);
        
        // Convert to UTC
        timeToPost = localDateTime.toISOString();
      }

      const { error } = await supabase
        .from('saved_posts')
        .update({
          title: selectedPost.title,
          platform: selectedPost.platform,
          content: selectedPost.content,
          hashtags: selectedPost.hashtags,
          time_to_post: timeToPost,
          media_url: selectedPost.imageUrl,
          media_type: selectedPost.imageUrl ? 'image' : null
        })
        .eq('game_id', selectedGame.id)
        .eq('local_date', selectedPost.localDate);

      if (error) throw error;

      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.localDate === selectedPost.localDate ? selectedPost : post
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
      console.log('Starting upload for file:', file.name, 'type:', file.type);
      
      // Get presigned URL from our API
      const response = await fetch('/api/upload-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Failed to get upload URL: ${response.status} ${response.statusText}`);
      }

      const { presignedUrl, fileUrl } = await response.json();
      console.log('Got presigned URL:', presignedUrl);

      // Upload file directly to R2 using presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'Origin': window.location.origin,
        },
        mode: 'cors',
      });

      if (!uploadResponse.ok) {
        console.error('Upload Error:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText
        });
        throw new Error(`Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      console.log('Upload successful, file URL:', fileUrl);

      // Save the file URL to the database
      const { error: dbError } = await supabase
        .from('saved_posts')
        .update({
          media_url: fileUrl,
          media_type: file.type.startsWith('image/') ? 'image' : 'video'
        })
        .eq('game_id', selectedGame.id)
        .eq('local_date', selectedPost.localDate);

      if (dbError) {
        console.error('Error saving media URL to database:', dbError);
        throw new Error('Failed to save media URL to database');
      }

      // Update the post with the new media URL
      setSelectedPost({ ...selectedPost, imageUrl: fileUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error instanceof Error && error.message.includes('CORS')) {
        alert('Failed to upload image: CORS error. Please check your R2 bucket CORS configuration.');
      } else {
        alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
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

      const newStatus = selectedPost.status === 'scheduled' && originalScheduledTime === selectedPost.scheduledTime ? 'draft' : 'scheduled';
      
      // Convert local time to UTC
      let timeToPost = null;
      if (selectedPost.scheduledTime && selectedPost.localDate) {
        // Combine local date and time
        const [year, month, day] = selectedPost.localDate.split('-').map(Number);
        const [hours, minutes] = selectedPost.scheduledTime.split(':').map(Number);
        
        // Create a date object in local timezone
        const localDateTime = new Date(year, month - 1, day, hours, minutes);
        
        // Convert to UTC
        timeToPost = localDateTime.toISOString();
      }
      
      // Update both post content and scheduling status in a single operation
      const updateData = {
        title: selectedPost.title,
        platform: selectedPost.platform,
        content: selectedPost.content,
        hashtags: selectedPost.hashtags,
        status: newStatus,
        ...(newStatus === 'scheduled' ? {
          time_to_post: timeToPost,
          media_url: selectedPost.imageUrl,
          media_type: selectedPost.imageUrl ? 'image' : null
        } : {})
      };

      const { error } = await supabase
        .from('saved_posts')
        .update(updateData)
        .eq('game_id', selectedGame.id)
        .eq('local_date', selectedPost.localDate);

      if (error) throw error;

      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.timeToPost === selectedPost.timeToPost ? { ...selectedPost, status: newStatus } : post
        )
      );
      setSelectedPost({ ...selectedPost, status: newStatus });
      if (newStatus === 'scheduled') {
        setOriginalScheduledTime(selectedPost.scheduledTime || null);
      }
    } catch (error) {
      console.error('Error updating post status:', error);
    } finally {
      setScheduling(false);
    }
  };

  const checkCurrentDayScheduledPosts = async () => {
    if (!selectedGame) return;

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    // Find today's post in the local state
    const todayPost = posts.find(post => post.localDate === today && post.status === 'scheduled');

    if (todayPost && todayPost.scheduledTime) {
      // Parse the scheduled time
      const [hours, minutes] = todayPost.scheduledTime.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // If the scheduled time has passed, check the database for the current status
      if (scheduledTime < now) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          // Get the current status from the database
          const { data: dbPost } = await supabase
            .from('saved_posts')
            .select('status')
            .eq('game_id', selectedGame.id)
            .eq('local_date', today)
            .single();

          if (dbPost) {
            // Update the local state with the status from the database
            setPosts(prevPosts => 
              prevPosts.map(post => 
                post.localDate === today ? { ...post, status: dbPost.status } : post
              )
            );

            // If the post is currently being edited, update the selectedPost state
            if (selectedPost && selectedPost.localDate === today) {
              setSelectedPost(prev => prev ? { ...prev, status: dbPost.status } : null);
            }
          }
        } catch (error) {
          console.error('Error checking post status:', error);
        }
      }
    }
  };

  // Add an interval to check current day's scheduled posts every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkCurrentDayScheduledPosts();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [posts, selectedGame]); // Add selectedGame as a dependency

  // Also check when the component mounts
  useEffect(() => {
    checkCurrentDayScheduledPosts();
  }, [posts, selectedGame]); // Add selectedGame as a dependency

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
                if (!p.localDate) return false;
                const postDate = p.localDate;
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
                      className={`p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-700 ${
                        post?.status === 'draft' 
                          ? 'border-blue-500 dark:border-blue-600' 
                          : post?.status === 'failed'
                          ? 'border-red-500 dark:border-red-600'
                          : post?.status === 'scheduled'
                          ? 'border-yellow-500 dark:border-yellow-600'
                          : post?.status === 'published'
                          ? 'border-green-500 dark:border-green-600'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                      onClick={() => handlePostClick(fullDate)}
                    >
                      {post ? (
                        <>
                          <div className="mb-3">
                            <span className="font-medium text-gray-900 dark:text-white">Title:</span> 
                            <span className="text-gray-700 dark:text-gray-300"> {post.title}</span>
                          </div>
                          <div className="mb-3">
                            <span className="font-medium text-gray-900 dark:text-white">Platform:</span> 
                            <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              {post.platform === 'Twitter' ? (
                                <Twitter className="h-4 w-4 text-blue-400" />
                              ) : post.platform === 'TikTok' ? (
                                <Music className="h-4 w-4 text-pink-500" />
                              ) : null}
                              {post.platform}
                            </span>
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
          selectedPost?.status === 'draft' 
            ? 'border-blue-500 dark:border-blue-600' 
            : selectedPost?.status === 'failed'
            ? 'border-red-500 dark:border-red-600'
            : selectedPost?.status === 'scheduled'
            ? 'border-yellow-500 dark:border-yellow-600'
            : selectedPost?.status === 'published'
            ? 'border-green-500 dark:border-green-600'
            : 'border-gray-200 dark:border-gray-600'
        }`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Post for {selectedPost?.localDate ? new Date(selectedPost.localDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ''}
            </DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="grid grid-cols-2 gap-6 py-4">
              {/* Left Column - Image Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Platform
                  </Label>
                  <Select
                    value={selectedPost.platform}
                    onValueChange={(value) => setSelectedPost({...selectedPost, platform: value})}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-9">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Twitter">
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-blue-400" />
                          <span>Twitter</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="TikTok">
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-pink-500" />
                          <span>TikTok</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
                      Post Image
                    </Label>
                  </div>
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
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
                      Recommended Media
                    </Label>
                    <div className="relative group">
                      <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help">ⓘ</span>
                      <div className="absolute left-0 top-6 w-80 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Suggested images/videos for this post:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <li>Gameplay screenshot showing [specific feature]</li>
                            <li>Character close-up with [specific emotion]</li>
                            <li>Action sequence from [specific level]</li>
                            <li>Behind-the-scenes development clip</li>
                            <li>Community highlight reel</li>
                          </ul>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Tip: Use high-quality images (1920x1080) and keep videos under 60 seconds for best engagement.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedPost.mediaSuggestion || 'No media suggestions available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Main Content */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={selectedPost.title}
                    onChange={(e) => setSelectedPost({...selectedPost, title: e.target.value})}
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
                    // originalScheduledTime + "   " + selectedPost.scheduledTime
                      originalScheduledTime !== selectedPost.scheduledTime ? 'Reschedule' : 'Unschedule Post'
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