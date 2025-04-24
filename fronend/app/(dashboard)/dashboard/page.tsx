import { redirect } from 'next/navigation';
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
  redirect('/post-week');
}