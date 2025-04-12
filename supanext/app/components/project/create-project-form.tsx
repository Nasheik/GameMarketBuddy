'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
// import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const GAME_GENRES = ['action', 'adventure', 'rpg', 'strategy', 'simulation', 'sports', 'puzzle', 'other'] as const;
const PLATFORMS = ['twitter', 'tiktok', 'reddit', 'instagram', 'facebook'] as const;

export default function CreateProjectForm() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<typeof GAME_GENRES[number]>('action');
  const [description, setDescription] = useState('');
  const [steamUrl, setSteamUrl] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [platforms, setPlatforms] = useState<typeof PLATFORMS[number][]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error('Please sign in to create a project');
        router.push('/sign-in');
        return;
      }

      // Insert the project into the database
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            title,
            user_id: user.id,
            genre,
            description,
            steam_url: steamUrl,
            trailer_url: trailerUrl,
            platforms,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (projectError) throw projectError;

      toast.success('Project created successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>
          Fill in the details below to create a new project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Select
              value={genre}
              onValueChange={(value) => setGenre(value as typeof GAME_GENRES[number])}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {GAME_GENRES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {/* <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Enter project description"
              disabled={loading}
            /> */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="steamUrl">Steam URL</Label>
            <Input
              id="steamUrl"
              value={steamUrl}
              onChange={(e) => setSteamUrl(e.target.value)}
              placeholder="Enter Steam URL (optional)"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trailerUrl">Trailer URL</Label>
            <Input
              id="trailerUrl"
              value={trailerUrl}
              onChange={(e) => setTrailerUrl(e.target.value)}
              placeholder="Enter trailer URL (optional)"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => (
                <Button
                  key={platform}
                  type="button"
                  variant={platforms.includes(platform) ? "default" : "outline"}
                  onClick={() => {
                    if (platforms.includes(platform)) {
                      setPlatforms(platforms.filter(p => p !== platform));
                    } else {
                      setPlatforms([...platforms, platform]);
                    }
                  }}
                  disabled={loading}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 