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
                <option value="sports">Sports</option>
                <option value="puzzle">Puzzle</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="releaseStatus" className="block text-sm font-medium mb-2">
                Release Status
              </label>
              <select
                id="releaseStatus"
                name="releaseStatus"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select release status</option>
                <option value="in_development">In Development</option>
                <option value="early_access">Early Access</option>
                <option value="released">Released</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              Create Game Profile
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 