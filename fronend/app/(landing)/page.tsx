import { Metadata } from 'next';
import { createClient } from "@/utils/supabase/server";
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GameMarketBuddy - Social Media Management for Game Developers',
  description: 'Streamline your social media presence with GameMarketBuddy',
};

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-8">GameMarketBuddy</h1>
        <p className="text-xl mb-8 max-w-2xl">
          The all-in-one social media management platform designed specifically for game developers.
          Schedule posts, manage multiple platforms, and grow your audience with ease.
        </p>
        <div className="space-x-4">
          {session ? (
            <Link 
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              href="/sign-in"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Get Started
            </Link>
          )}
          <Link 
            href="#features"
            className="bg-transparent border border-white hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-6 rounded-lg"
          >
            Learn More
          </Link>
        </div>
      </main>
    </div>
  );
} 