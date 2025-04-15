export default function Socials() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Social Media</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Twitter</h2>
          <p className="text-gray-600 mb-4">Manage your Twitter presence and analytics.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            Connect Account
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Discord</h2>
          <p className="text-gray-600 mb-4">Manage your Discord server and community.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            Connect Server
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Steam Community</h2>
          <p className="text-gray-600 mb-4">Manage your Steam community hub and announcements.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            Connect Steam
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">YouTube</h2>
          <p className="text-gray-600 mb-4">Manage your YouTube channel and content.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            Connect Channel
          </button>
        </div>
      </div>
    </div>
  );
} 