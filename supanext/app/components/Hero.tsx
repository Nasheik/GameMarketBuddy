import Link from 'next/link';

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Your Game. 30 Days of Posts. Done in Minutes.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Generate a month's worth of engaging social media content for your game with AI-powered suggestions.
        </p>
        <Link
          href="/auth/sign-up"
          className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          Generate Content
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
} 