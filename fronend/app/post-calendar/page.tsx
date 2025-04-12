'use client';

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface ScheduledPost {
  id: string;
  game_id: string;
  content: string;
  media_url: string | null;
  scheduled_time: string;
  status: string;
  platforms: string[];
  title: string;
}

export default function PostCalendar() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .order('scheduled_time', { ascending: true });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    setScheduledPosts(data || []);
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full p-4 overflow-x-hidden">
      <div className="grid grid-cols-7 grid-rows-4 gap-2 h-full">
        {Array.from({ length: 28 }, (_, i) => (
          <div 
            key={i + 1}
            className="bg-white rounded-lg shadow p-2 flex flex-col"
          >
            {/* Top section with number and status */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{i + 1}</span>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>

            {/* Middle section for image */}
            <div className="flex-1 flex items-center justify-center my-2">
              <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
                Image
              </div>
            </div>

            {/* Bottom section for caption */}
            <div className="text-xs text-gray-600 truncate">
              Caption text goes here
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
