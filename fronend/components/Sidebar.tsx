'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Mail, 
  Twitter, 
  Youtube, 
  MessageCircle,
  Share2,
  LucideIcon
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export default function Sidebar() {
  const pathname = usePathname();
  
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Steam', href: '/steam', icon: BarChart3 },
    { name: 'Email Marketing', href: '/email', icon: Mail },
    { name: 'Twitter', href: '/twitter', icon: Twitter },
    { name: 'YouTube', href: '/youtube', icon: Youtube },
    { name: 'TikTok', href: '/tiktok', icon: Share2 },
    { name: 'Discord', href: '/discord', icon: MessageCircle },
  ];

  return (
    <div className="flex h-full flex-col bg-white w-64 border-r shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">PostScheduler</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          <div>
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
