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
  day: string;
  postType: string;
  platform: string;
  content: string;
  hashtags: string[];
  bestTime: string;
  imageUrl?: string;
  status?: 'draft' | 'scheduled' | 'published' | 'failed';
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
        .order('day_of_week');

      if (savedPosts) {
        const formattedPosts = savedPosts.map(post => ({
          day: post.day_of_week,
          postType: post.post_type,
          platform: post.platform,
          content: post.content,
          hashtags: post.hashtags,
          bestTime: post.best_time,
          status: post.status,
          imageUrl: post.media_url
        }));
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
    if (currentIndex < daysOfWeek.length - 3) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePostClick = (day: string) => {
    const post = posts.find(p => p.day === day);
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
          best_time: selectedPost.bestTime
        })
        .eq('game_id', selectedGame.id)
        .eq('day_of_week', selectedPost.day);

      if (error) throw error;

      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.day === selectedPost.day ? selectedPost : post
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
      const fileName = `${selectedGame.id}-${selectedPost.day}-${Date.now()}.${fileExt}`;
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

    setScheduling(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;


      const today = new Date();
      const scheduledTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()+3);

      const newStatus = selectedPost.status === 'scheduled' ? 'draft' : 'scheduled';
      
      // Only set time_to_post if we're scheduling the post
      const updateData = {
        status: newStatus,
        ...(newStatus === 'scheduled' ? {
          time_to_post: scheduledTime.toISOString(), // You might want to use the bestTime here
          media_url: selectedPost.imageUrl,
          media_type: selectedPost.imageUrl ? 'image' : null
        } : {})
      };
      console.log("hello");

      const { error } = await supabase
        .from('saved_posts')
        .update(updateData)
        .eq('game_id', selectedGame.id)
        .eq('day_of_week', selectedPost.day);

      console.log("hello");

      if (error) throw error;

      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.day === selectedPost.day ? { ...selectedPost, status: newStatus } : post
        )
      );
      setSelectedPost({ ...selectedPost, status: newStatus });
    } catch (error) {
      console.log('Error updating post status:', error);
    } finally {
      setScheduling(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!selectedGame) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No game selected. Please select a game from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Post Week</h1>
        <Button 
          onClick={handleGenerate} 
          disabled={generating}
          className="bg-blue-600 hover:bg-blue-700 text-white"
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

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-gray-200 hover:bg-gray-300"
          >
            ← Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex >= daysOfWeek.length - 3}
            className="bg-gray-200 hover:bg-gray-300"
          >
            Next →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {daysOfWeek.slice(currentIndex, currentIndex + 3).map((day) => {
            const post = posts.find(p => p.day === day);
            return (
              <Card 
                key={day} 
                className={`p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                  post?.status === 'scheduled' ? 'border-green-500' : ''
                }`}
                onClick={() => handlePostClick(day)}
              >
                <h2 className="text-xl font-semibold mb-4">{day}</h2>
                {post ? (
                  <>
                    <div className="mb-4">
                      <span className="font-medium">Type:</span> {post.postType}
                    </div>
                    <div className="mb-4">
                      <span className="font-medium">Platform:</span> {post.platform}
                    </div>
                    <div className="mb-4">
                      <span className="font-medium">Content:</span>
                      <p className="mt-2 text-gray-600">{post.content}</p>
                    </div>
                    <div className="mb-4">
                      <span className="font-medium">Hashtags:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.hashtags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="font-medium">Best Time to Post:</span> {post.bestTime}
                    </div>
                    {post.status === 'scheduled' && (
                      <div className="text-green-600 font-medium">
                        Scheduled for {post.bestTime}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500 italic">
                    No post generated for this day
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Edit Post for {selectedPost?.day}</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="grid grid-cols-2 gap-8 py-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="postType" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Post Type
                  </Label>
                  <Input
                    id="postType"
                    value={selectedPost.postType}
                    onChange={(e) => setSelectedPost({...selectedPost, postType: e.target.value})}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Platform
                  </Label>
                  <Input
                    id="platform"
                    value={selectedPost.platform}
                    onChange={(e) => setSelectedPost({...selectedPost, platform: e.target.value})}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-10"
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
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-10"
                    placeholder="Enter hashtags separated by commas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bestTime" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Best Time to Post
                  </Label>
                  <Input
                    id="bestTime"
                    value={selectedPost.bestTime}
                    onChange={(e) => setSelectedPost({...selectedPost, bestTime: e.target.value})}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-10"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSchedule}
                      disabled={scheduling}
                      className={`${
                        selectedPost?.status === 'scheduled' 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {scheduling ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {selectedPost?.status === 'scheduled' ? 'Unscheduling...' : 'Scheduling...'}
                        </>
                      ) : selectedPost?.status === 'scheduled' ? (
                        'Unschedule Post'
                      ) : (
                        'Schedule Post'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditModalOpen(false)}
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSavePost}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Post Image
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                    {selectedPost.imageUrl ? (
                      <div className="relative">
                        <img 
                          src={selectedPost.imageUrl} 
                          alt="Post preview" 
                          className="w-full h-64 object-cover rounded-lg"
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
                      <div className="flex flex-col items-center justify-center h-64">
                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
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
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Suggested images/videos for this post:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li>Gameplay screenshot showing [specific feature]</li>
                        <li>Character close-up with [specific emotion]</li>
                        <li>Action sequence from [specific level]</li>
                        <li>Behind-the-scenes development clip</li>
                        <li>Community highlight reel</li>
                      </ul>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Tip: Use high-quality images (1920x1080) and keep videos under 60 seconds for best engagement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 