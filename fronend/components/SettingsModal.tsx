'use client';

import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Add your settings content here */}
            <div>
              <h3 className="text-lg font-medium mb-4">Account Settings</h3>
              {/* Add account settings fields */}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Preferences</h3>
              {/* Add preference settings fields */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 