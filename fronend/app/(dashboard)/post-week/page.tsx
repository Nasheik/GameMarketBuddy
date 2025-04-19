'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Post {
  day: string;
  postType: string;
  platform: string;
  content: string;
  hashtags: string[];
  bestTime: string;
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
          bestTime: post.best_time
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
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
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
                    <div>
                      <span className="font-medium">Best Time to Post:</span> {post.bestTime}
                    </div>
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
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Edit Post for {selectedPost?.day}</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="postType" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  Type
                </Label>
                <Input
                  id="postType"
                  value={selectedPost.postType}
                  onChange={(e) => setSelectedPost({...selectedPost, postType: e.target.value})}
                  className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="platform" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  Platform
                </Label>
                <Input
                  id="platform"
                  value={selectedPost.platform}
                  onChange={(e) => setSelectedPost({...selectedPost, platform: e.target.value})}
                  className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  Content
                </Label>
                <Input
                  id="content"
                  value={selectedPost.content}
                  onChange={(e) => setSelectedPost({...selectedPost, content: e.target.value})}
                  className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hashtags" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  Hashtags
                </Label>
                <Input
                  id="hashtags"
                  value={selectedPost.hashtags.join(', ')}
                  onChange={(e) => setSelectedPost({...selectedPost, hashtags: e.target.value.split(',').map(tag => tag.trim())})}
                  className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bestTime" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  Best Time
                </Label>
                <Input
                  id="bestTime"
                  value={selectedPost.bestTime}
                  onChange={(e) => setSelectedPost({...selectedPost, bestTime: e.target.value})}
                  className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 