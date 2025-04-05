import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isNegative?: boolean;
}

function StatsCard({ title, value, change, isNegative = false }: StatsCardProps) {
  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-semibold">{value}</p>
        <span className={`ml-2 text-sm font-medium ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
          {change}
        </span>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
          Schedule New Post
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Posts" value="128" change="+12%" />
        <StatsCard title="Engagement Rate" value="4.8%" change="+0.6%" />
        <StatsCard title="Click-through Rate" value="2.1%" change="-0.3%" isNegative />
        <StatsCard title="Scheduled Posts" value="15" change="+3%" />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-medium">Performance By Platform</h2>
          <div className="h-64 w-full bg-gray-100 rounded flex items-center justify-center text-gray-500">
            Platform Performance Chart
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-medium">Upcoming Scheduled Posts</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Post Title {i}</p>
                  <p className="text-sm text-gray-500">Tomorrow at 9:00 AM • Twitter</p>
                </div>
                <button className="text-sm text-blue-600 hover:underline">Edit</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <div>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-medium">Recent Post Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm font-medium text-gray-500">
                  <th className="pb-2">Post</th>
                  <th className="pb-2">Platform</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Impressions</th>
                  <th className="pb-2">Engagement</th>
                  <th className="pb-2">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3">Post Title {i}</td>
                    <td className="py-3">
                      {['Twitter', 'YouTube', 'Discord', 'Steam', 'TikTok'][i % 5]}
                    </td>
                    <td className="py-3">Apr {i}, 2025</td>
                    <td className="py-3">{Math.floor(Math.random() * 10000)}</td>
                    <td className="py-3">{Math.floor(Math.random() * 1000)}</td>
                    <td className="py-3">{Math.floor(Math.random() * 500)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}