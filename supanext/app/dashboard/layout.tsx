import { ReactNode } from 'react';
import Link from 'next/link';
import { CalendarDays, PlusCircle } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <nav className="p-4 space-y-2">
          <div className="mb-4 px-4 py-3">
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
          
          <Link 
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-accent transition-colors"
          >
            <CalendarDays size={20} />
            <span>Content Calendar</span>
          </Link>

          <Link 
            href="/dashboard/generate"
            className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-accent transition-colors"
          >
            <PlusCircle size={20} />
            <span>Generate Posts</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 