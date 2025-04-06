export default function Integrations() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Analytics Tools</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Google Analytics</p>
                <p className="text-sm text-gray-500">Track website and store performance</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
                Connect
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Steam Analytics</p>
                <p className="text-sm text-gray-500">Track Steam store performance</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
                Connect
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Marketing Tools</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mailchimp</p>
                <p className="text-sm text-gray-500">Email marketing automation</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
                Connect
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Buffer</p>
                <p className="text-sm text-gray-500">Social media scheduling</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 