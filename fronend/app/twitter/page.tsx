export default function TwitterPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Twitter Management</h1>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
            Schedule Twitter Post
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h2 className="text-lg font-medium">Account Overview</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Followers</span>
                <span className="font-medium">12,342</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Following</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Posts</span>
                <span className="font-medium">3,421</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 md:col-span-2">
            <h2 className="text-lg font-medium">Scheduled Tweets</h2>
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Tweet {i}</p>
                    <p className="text-sm text-gray-500">Apr {i+1}, 2025 at 10:00 AM</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded px-3 py-1 text-sm text-blue-600 hover:bg-blue-50">
                      Edit
                    </button>
                    <button className="rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-medium">Twitter Analytics</h2>
          <div className="h-64 w-full bg-gray-100 rounded flex items-center justify-center text-gray-500">
            Twitter Performance Chart
          </div>
        </Card>
      </div>
    );
  }