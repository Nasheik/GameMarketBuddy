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
  
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const gameData = {
    user_id: session.user.id,
    title: formData.get('gameTitle'),
    description: formData.get('gameDescription'),
    genre: formData.get('genre'),
    manual_tags: formData.get('manualTags')?.toString().split(',').map(tag => tag.trim()) || [],
    development_stage: formData.get('developmentStage'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('games')
    .insert([gameData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to create game');
  }

  redirect('/dashboard');
}

export default async function CreateGamePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }
console.log(user.id );
  // Check if user has an active subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .gt('current_period_end', new Date().toISOString())
    .single();

    console.log(subscription?.length);

  if (!subscription) {
    redirect('/payment');
  }

  // Check if user has any games
  const { data: games } = await supabase
    .from('games')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);

  if (games && games.length > 0) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Enter Your Game's Details</h1>
          <form className="space-y-3" action={createGame}>
            <div>
              <label htmlFor="gameTitle" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Game Title
              </label>
              <input
                type="text"
                id="gameTitle"
                name="gameTitle"
                required
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your game's name"
              />
            </div>
            
            <div>
              <label htmlFor="gameDescription" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Game Description
              </label>
              <textarea
                id="gameDescription"
                name="gameDescription"
                required
                rows={3}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your game"
              />
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Genre
              </label>
              <select
                id="genre"
                name="genre"
                required
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label htmlFor="manualTags" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Custom Tags
              </label>
              <input
                type="text"
                id="manualTags"
                name="manualTags"
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add custom tags (comma separated)"
              />
            </div>

            <div>
              <label htmlFor="developmentStage" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Development Stage
              </label>
              <select
                id="developmentStage"
                name="developmentStage"
                required
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Create Game
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 