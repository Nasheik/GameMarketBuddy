'use client';

import { useGame } from '@/context/GameContext';
import { useUser } from '@/context/UserContext';
import { 
  Settings,
  GamepadIcon,
  Pencil,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import GameDetailsModal from './GameDetailsModal';
import SettingsModal from './SettingsModal';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopNav() {
  const { selectedGame, games, setSelectedGame, isLoading } = useGame();
  const { user, isLoading: isUserLoading } = useUser();
  const [isGameDetailsOpen, setIsGameDetailsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Get the username from email if name doesn't exist
  const displayName = user?.full_name || (user?.email ? user.email.split('@')[0] : '');
  const initials = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Game Market Buddy</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <select
                  value={selectedGame?.id || ""}
                  onChange={(e) => {
                    const game = games.find((g) => g.id === e.target.value);
                    if (game) setSelectedGame(game);
                  }}
                  className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                <button
                  onClick={() => setIsGameDetailsOpen(true)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Edit Game Details"
                >
                  <Pencil className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{displayName}</span>
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{initials}</span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Settings"
              >
                <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <GameDetailsModal 
        isOpen={isGameDetailsOpen} 
        onClose={() => setIsGameDetailsOpen(false)} 
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
} 