import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative isolate">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/10">
            Now in Public Beta
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            AI-Powered Social Media
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"> for Game Developers</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Transform your game's social media presence with AI-generated content. Get a month's worth of engaging posts in minutes, perfectly crafted for each platform.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/projects/new"
              className="rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
            >
              Start Creating Content
            </a>
            <a href="#how-it-works" className="text-lg font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 lg:mt-20">
            <div className="flex flex-col items-center gap-y-2 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200/50 p-4">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">30+</div>
              <div className="text-sm text-gray-600">Posts Generated</div>
            </div>
            <div className="flex flex-col items-center gap-y-2 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200/50 p-4">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">5x</div>
              <div className="text-sm text-gray-600">Faster Creation</div>
            </div>
            <div className="flex flex-col items-center gap-y-2 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200/50 p-4">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">3+</div>
              <div className="text-sm text-gray-600">Platforms</div>
            </div>
            <div className="flex flex-col items-center gap-y-2 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200/50 p-4">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">24/7</div>
              <div className="text-sm text-gray-600">AI Assistant</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
