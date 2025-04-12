import { Metadata } from 'next';
// import Calendar from '@/components/dashboard/calendar';

export const metadata: Metadata = {
  title: 'Dashboard - Content Calendar',
  description: 'View and manage your content calendar',
};

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Content Calendar</h1>
      </div>
      {/* <Calendar /> */}
    </div>
  );
} 