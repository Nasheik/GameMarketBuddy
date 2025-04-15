export default function Email() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Email Campaigns</h1>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Campaign</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            New Campaign
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="font-medium">Welcome Email Series</p>
              <p className="text-sm text-gray-500">Last sent: 2 days ago</p>
            </div>
            <div className="border-b pb-4">
              <p className="font-medium">Game Update Announcement</p>
              <p className="text-sm text-gray-500">Last sent: 1 week ago</p>
            </div>
            <div className="border-b pb-4">
              <p className="font-medium">Special Offer</p>
              <p className="text-sm text-gray-500">Last sent: 2 weeks ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 