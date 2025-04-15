'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGame } from '@/context/GameContext';
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
  LucideIcon,
  HomeIcon,
  GamepadIcon,
  CalendarIcon,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { selectedGame, games, setSelectedGame, isLoading } = useGame();

  const isActive = (path: string) => pathname === path;

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Game Details', href: '/game-details', icon: GamepadIcon },
    { name: 'Post Week', href: '/post-week', icon: CalendarIcon },
    { name: 'Post Calendar', href: '/post-calendar', icon: Calendar },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-full flex-col bg-white w-64 border-r shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">[Game Name]</h2>
        <select
          value={selectedGame?.id || ""}
          onChange={(e) => {
            const game = games.find((g) => g.id === e.target.value);
            if (game) setSelectedGame(game);
          }}
          className="w-full p-2 border rounded-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <option value="">Loading games...</option>
          ) : games.length === 0 ? (
            <option value="">No games available</option>
          ) : (
            games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.title}
              </option>
            ))
          )}
        </select>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(item.href)
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
