import { Metadata } from 'next';
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Create Your Game - GameMarketBuddy',
  description: 'Set up your game profile on GameMarketBuddy',
};

async function createGame(formData: FormData) {
  'use server';
  
  const headersList = await headers();
  const origin = headersList.get('origin') || '';
  const cookie = headersList.get('cookie') || '';
  
  const response = await fetch(`${origin}/api/games`, {
    method: 'POST',
    body: formData,
    headers: {
      'Cookie': cookie
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create game');
  }

  redirect('/dashboard');
}

export default async function CreateGamePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/sign-in');
  }

  // Check if user has an active subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', session.user.id)
    .eq('status', 'active')
    .gt('current_period_end', new Date().toISOString())
    .single();

  if (!subscription) {
    redirect('/payment');
  }

  // Check if user has any games
  const { data: games } = await supabase
    .from('games')
    .select('id')
    .eq('user_id', session.user.id)
    .limit(1);

  if (games && games.length > 0) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Create Your Game Profile</h1>
          <form className="space-y-6" action={createGame}>
            <div>
              <label htmlFor="gameName" className="block text-sm font-medium mb-2">
                Game Name
              </label>
              <input
                type="text"
                id="gameName"
                name="gameName"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your game's name"
              />
            </div>
            
            <div>
              <label htmlFor="gameDescription" className="block text-sm font-medium mb-2">
                Game Description
              </label>
              <textarea
                id="gameDescription"
                name="gameDescription"
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your game"
              />
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium mb-2">
                Genre
              </label>
              <select
                id="genre"
                name="genre"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a genre</option>
                <option value="action">Action</option>
                <option value="adventure">Adventure</option>
                <option value="rpg">RPG</option>
                <option value="strategy">Strategy</option>
                <option value="simulation">Simulation</option>
                <option value="puzzle">Puzzle</option>
                <option value="platformer">Platformer</option>
                <option value="shooter">Shooter</option>
              </select>
            </div>

            <div>
              <label htmlFor="manualTags" className="block text-sm font-medium mb-2">
                Custom Tags
              </label>
              <input
                type="text"
                id="manualTags"
                name="manualTags"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add custom tags (comma separated)"
              />
            </div>

            <div>
              <label htmlFor="targetPlatforms" className="block text-sm font-medium mb-2">
                Target Platforms
              </label>
              <select
                id="targetPlatforms"
                name="targetPlatforms"
                multiple
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="steam">Steam</option>
                <option value="itch">itch.io</option>
                <option value="epic">Epic Games Store</option>
                <option value="gog">GOG</option>
                <option value="console">Console</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>

            <div>
              <label htmlFor="marketingPlatforms" className="block text-sm font-medium mb-2">
                Marketing Platforms
              </label>
              <select
                id="marketingPlatforms"
                name="marketingPlatforms"
                multiple
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="twitter">Twitter</option>
                <option value="reddit">Reddit</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="discord">Discord</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div>
              <label htmlFor="releaseStatus" className="block text-sm font-medium mb-2">
                Development Stage
              </label>
              <select
                id="releaseStatus"
                name="releaseStatus"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select development stage</option>
                <option value="prototype">Prototype</option>
                <option value="alpha">Alpha</option>
                <option value="beta">Beta</option>
                <option value="release">Release</option>
                <option value="post-launch">Post-launch</option>
              </select>
            </div>

            <div>
              <label htmlFor="marketingGoals" className="block text-sm font-medium mb-2">
                Marketing Goals
              </label>
              <input
                type="text"
                id="marketingGoals"
                name="marketingGoals"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Wishlist growth, Devlog visibility, Community engagement"
              />
            </div>

            <div>
              <label htmlFor="toneAndStyle" className="block text-sm font-medium mb-2">
                Tone and Style
              </label>
              <select
                id="toneAndStyle"
                name="toneAndStyle"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select tone and style</option>
                <option value="casual">Casual</option>
                <option value="hype">Hype</option>
                <option value="devlog">Devlog</option>
                <option value="inspirational">Inspirational</option>
                <option value="professional">Professional</option>
                <option value="humorous">Humorous</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors font-medium"
              >
                Create Game Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 