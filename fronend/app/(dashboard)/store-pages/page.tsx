export default function StorePages() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Store Pages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Steam Store Page</h2>
          <p className="text-gray-600 mb-4">Manage your game's presence on Steam.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            Edit Page
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Epic Games Store</h2>
          <p className="text-gray-600 mb-4">Manage your game's presence on Epic Games Store.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            Edit Page
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">GOG Store</h2>
          <p className="text-gray-600 mb-4">Manage your game's presence on GOG.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            Edit Page
          </button>
        </div>
      </div>
    </div>
  );
} 