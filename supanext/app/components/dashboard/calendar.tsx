'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format, startOfToday, eachDayOfInterval, startOfMonth, endOfMonth, isToday, isSameMonth } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ContentPost = {
  id: string;
  platform: string;
  content_text: string;
  scheduled_date: string;
  is_posted: boolean;
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const startDate = startOfMonth(currentDate);
        const endDate = endOfMonth(currentDate);

        const { data, error } = await supabase
          .from('content_calendar')
          .select(`
            id,
            platform,
            content_text,
            scheduled_date,
            is_posted
          `)
          .gte('scheduled_date', startDate.toISOString())
          .lte('scheduled_date', endDate.toISOString())
          .order('scheduled_date', { ascending: true });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentDate, supabase]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <CalendarIcon className="w-5 h-5" />
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-background p-4 text-center text-sm font-medium"
          >
            {day}
          </div>
        ))}

        {days.map((day, dayIdx) => {
          const dayPosts = posts.filter(
            (post) => format(new Date(post.scheduled_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          );

          return (
            <div
              key={day.toString()}
              className={`
                bg-background p-4 min-h-[120px] relative
                ${!isSameMonth(day, currentDate) ? 'text-muted-foreground' : ''}
                ${isToday(day) ? 'bg-accent/50' : ''}
              `}
            >
              <time dateTime={format(day, 'yyyy-MM-dd')} className="text-sm">
                {format(day, 'd')}
              </time>
              <div className="mt-2 space-y-1">
                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    className="text-xs p-1 rounded bg-primary/10 truncate"
                  >
                    <Badge variant={post.is_posted ? "default" : "outline"} className="text-[10px]">
                      {post.platform}
                    </Badge>
                    <p className="mt-1 truncate">{post.content_text}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
} 