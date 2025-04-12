'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Mail, 
  BookImage, 
  MessageCircleCode,
  Blocks,
  FilePlus,
  Share2,
  Settings,
  Calendar,
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
    { name: 'Store Pages', href: '/store-pages', icon: BookImage },
    { name: 'Email', href: '/email', icon: Mail },
    { name: 'Post Creator', href: '/post-creator', icon: FilePlus },
    { name: 'Post Calendar', href: '/post-calendar', icon: Calendar },
    { name: 'Socials', href: '/socials', icon: MessageCircleCode },
    { name: 'Integrations', href: '/integrations', icon: Blocks },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-full flex-col bg-white w-64 border-r shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">[Game Name]</h2>
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
      <h2 className="text-xl font-bold">[Company Name]</h2>

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
