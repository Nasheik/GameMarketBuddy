'use client';

import { Twitter, MessageCircle, Gamepad2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PostType } from '../types';

interface PreviewSectionProps {
  showPreviews: boolean;
  setShowPreviews: (show: boolean) => void;
  selectedPlatforms: string[];
  title: string;
  content: string;
  mediaPreview: string | null;
  mediaType: 'image' | 'video' | null;
  postType: PostType;
  announcementType: string;
  discountCode: string;
  validUntil: string;
}

export default function PreviewSection({
  showPreviews,
  setShowPreviews,
  selectedPlatforms,
  title,
  content,
  mediaPreview,
  mediaType,
  postType,
  announcementType,
  discountCode,
  validUntil,
}: PreviewSectionProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`absolute right-0 top-0 transition-all duration-300 ${
      showPreviews ? 'w-[40.33%]' : 'w-[8.33%] h-[40%]'
    }`}>
      <div 
        className={`bg-white rounded-lg shadow h-full cursor-pointer hover:bg-gray-50 transition-colors ${
          !showPreviews && 'flex items-center justify-center'
        }`}
        onClick={() => setShowPreviews(!showPreviews)}
      >
        {showPreviews ? (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">Preview</span>
                  <span className="text-xs text-gray-500">
                    {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedPlatforms.includes('Twitter') && <Twitter className="h-5 w-5 text-blue-400" />}
                {selectedPlatforms.includes('Discord') && <MessageCircle className="h-5 w-5 text-indigo-500" />}
                {selectedPlatforms.includes('Steam') && <Gamepad2 className="h-5 w-5 text-gray-800" />}
              </div>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Twitter Preview */}
              {selectedPlatforms.includes('Twitter') && (
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <Twitter className="h-5 w-5 text-blue-400" />
                    <span className="font-medium">Twitter Preview</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Your Name</span>
                          <span className="text-gray-500">@username</span>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500">Just now</span>
                        </div>
                        <p className="mt-1">{content || 'Your post will appear here...'}</p>
                        {mediaPreview && (
                          <div className="mt-3 rounded-lg overflow-hidden">
                            {mediaType === 'image' ? (
                              <img 
                                src={mediaPreview} 
                                alt="Preview" 
                                className="w-full h-auto rounded-lg"
                              />
                            ) : (
                              <video 
                                src={mediaPreview} 
                                controls 
                                className="w-full h-auto rounded-lg"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Discord Preview */}
              {selectedPlatforms.includes('Discord') && (
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="h-5 w-5 text-indigo-500" />
                    <span className="font-medium">Discord Preview</span>
                  </div>
                  <div className="bg-[#36393f] p-4 rounded-lg text-white">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-500"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">Your Name</span>
                          <span className="text-gray-400 text-sm">Today at {new Date().toLocaleTimeString()}</span>
                        </div>
                        <div className="mt-1 space-y-2">
                          {title && <p className="font-medium">{title}</p>}
                          <p className="text-gray-300">{content || 'Your post will appear here...'}</p>
                          {mediaPreview && (
                            <div className="mt-2 rounded-lg overflow-hidden">
                              {mediaType === 'image' ? (
                                <img 
                                  src={mediaPreview} 
                                  alt="Preview" 
                                  className="w-full h-auto rounded-lg"
                                />
                              ) : (
                                <video 
                                  src={mediaPreview} 
                                  controls 
                                  className="w-full h-auto rounded-lg"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Steam Preview */}
              {selectedPlatforms.includes('Steam') && (
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <Gamepad2 className="h-5 w-5 text-gray-800" />
                    <span className="font-medium">Steam Preview</span>
                  </div>
                  <div className="bg-[#1b2838] p-4 rounded-lg text-white">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-600"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">Your Name</span>
                          <span className="text-gray-400 text-sm">Posted {new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2 space-y-2">
                          {title && <h3 className="text-lg font-medium">{title}</h3>}
                          <p className="text-gray-300">{content || 'Your post will appear here...'}</p>
                          {mediaPreview && (
                            <div className="mt-3 rounded-lg overflow-hidden">
                              {mediaType === 'image' ? (
                                <img 
                                  src={mediaPreview} 
                                  alt="Preview" 
                                  className="w-full h-auto rounded-lg"
                                />
                              ) : (
                                <video 
                                  src={mediaPreview} 
                                  controls 
                                  className="w-full h-auto rounded-lg"
                                />
                              )}
                            </div>
                          )}
                          {postType === 'announcement' && (
                            <div className="mt-2 p-2 bg-gray-700 rounded text-sm">
                              Announcement Type: {announcementType}
                            </div>
                          )}
                          {postType === 'promotion' && (
                            <div className="mt-2 p-2 bg-gray-700 rounded text-sm">
                              <p>Discount Code: {discountCode || 'CODE'}</p>
                              <p>Valid Until: {formatDate(validUntil)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPlatforms.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Select platforms above to see previews
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
              <div className="flex flex-col items-center [writing-mode:vertical-rl] [text-orientation:upright]">
                <span className="text-md font-medium text-gray-700">Preview</span>
              </div>
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 