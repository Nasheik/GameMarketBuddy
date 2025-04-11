import Hero from "@/components/hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="relative flex-1 flex flex-col gap-16 py-24">
        {/* Background decorative element */}
        {/* <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#3b82f6] to-[#9089fc] opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
          />
        </div> */}

        <section id="how-it-works" className="max-w-7xl mx-auto w-full px-6">
          <h2 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">How It Works</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process. No complex setup required.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200/50 hover:border-blue-500/20 hover:bg-gradient-to-b hover:from-blue-50/50 hover:to-transparent transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 text-white">
                <span className="text-xl font-semibold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-800">Create Your Project</h3>
              <p className="text-gray-600">
                Add your game's details, genre, media assets, and choose your target social platforms.
              </p>
            </div>
            <div className="group bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200/50 hover:border-blue-500/20 hover:bg-gradient-to-b hover:from-blue-50/50 hover:to-transparent transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 text-white">
                <span className="text-xl font-semibold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-800">Generate Content</h3>
              <p className="text-gray-600">
                Our AI generates 30 days of platform-optimized posts with text, media suggestions, and hashtags.
              </p>
            </div>
            <div className="group bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200/50 hover:border-blue-500/20 hover:bg-gradient-to-b hover:from-blue-50/50 hover:to-transparent transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 text-white">
                <span className="text-xl font-semibold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-800">Schedule & Share</h3>
              <p className="text-gray-600">
                Review your content calendar, make edits if needed, and export to your favorite scheduling tools.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto w-full px-6">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden rounded-2xl border-0">
            <CardHeader className="text-center pb-0 pt-12">
              <CardTitle className="text-4xl font-bold">Ready to Level Up Your Game's Social Media?</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-12">
              <p className="mb-10 text-xl opacity-90">
                Join game developers who are saving hours on social media content creation.
              </p>
              <Link
                href="/projects/new"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Create Your First Project
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
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
