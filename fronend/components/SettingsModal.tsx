'use client';

import { X, Laptop, Moon, Sun, Twitter, Youtube, MessageCircle, Gamepad2, Video } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Integration {
  platform: string;
  connected: boolean;
  username?: string;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [integrations, setIntegrations] = useState<Integration[]>([
    { platform: 'Twitter', connected: false },
    { platform: 'YouTube', connected: false },
    { platform: 'Discord', connected: false },
    { platform: 'Steam', connected: false },
    { platform: 'TikTok', connected: false },
  ]);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Twitter':
        return <Twitter className="h-5 w-5" />;
      case 'YouTube':
        return <Youtube className="h-5 w-5" />;
      case 'Discord':
        return <MessageCircle className="h-5 w-5" />;
      case 'Steam':
        return <Gamepad2 className="h-5 w-5" />;
      case 'TikTok':
        return <Video className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Theme Settings */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Theme</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-2 p-2 rounded-md border ${
                    theme === 'light' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Sun className="h-5 w-5" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-2 p-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Moon className="h-5 w-5" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex items-center justify-center gap-2 p-2 rounded-md border ${
                    theme === 'system' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Laptop className="h-5 w-5" />
                  <span>System</span>
                </button>
              </div>
            </div>

            {/* Integrations */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Integrations</h3>
              <div className="space-y-3">
                {integrations.map((integration) => (
                  <div
                    key={integration.platform}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(integration.platform)}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{integration.platform}</p>
                        {integration.username && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">@{integration.username}</p>
                        )}
                      </div>
                    </div>
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        integration.connected
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                          : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30'
                      }`}
                    >
                      {integration.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 