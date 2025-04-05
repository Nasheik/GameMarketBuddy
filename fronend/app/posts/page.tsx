'use client';

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  game_id: string;
  campaign_id: string | null;
  platform: string;
  content: string;
  media_url: string | null;
  scheduled_time: string;
  status: string;
  created_at: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [games, setGames] = useState<Array<{ id: string; name: string }>>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchGames();
    fetchPosts();
  }, []);

  const fetchGames = async () => {
    const { data: gamesData, error } = await supabase
      .from('games')
      .select('id, name');
    
    if (error) {
      console.error('Error fetching games:', error);
      return;
    }

    setGames(gamesData || []);
    if (gamesData && gamesData.length > 0) {
      setSelectedGame(gamesData[0].id);
    }
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    setPosts(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame || !content) return;

    const { error } = await supabase
      .from('scheduled_posts')
      .insert([
        {
          game_id: selectedGame,
          platform,
          content,
          scheduled_time: new Date().toISOString(),
          status: 'scheduled'
        }
      ]);

    if (error) {
      console.error('Error creating post:', error);
      return;
    }

    setContent('');
    fetchPosts();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Posts</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block mb-2">Game</label>
          <select
            value={selectedGame || ''}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="twitter">Twitter</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="email">Email</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <Button type="submit">Create Post</Button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium capitalize">{post.platform}</span>
              <span className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700">{post.content}</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500 capitalize">Status: {post.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 