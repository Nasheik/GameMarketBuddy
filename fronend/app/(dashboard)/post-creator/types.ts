export type PostType = 'short-form' | 'long-form' | 'announcement' | 'promotion';
export type TabType = 'drafts' | 'scheduled';

export interface Post {
  id: string;
  type: PostType;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  platforms: string[];
  scheduledFor?: string;
  createdAt: string;
}

export interface PostFormProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  mediaPreview: string | null;
  setMediaPreview: (url: string | null) => void;
  mediaType: 'image' | 'video' | null;
  setMediaType: (type: 'image' | 'video' | null) => void;
  handleMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isScheduled: boolean;
  setIsScheduled: (isScheduled: boolean) => void;
  scheduleDateTime: string;
  setScheduleDateTime: (dateTime: string) => void;
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
  handlePlatformChange: (platform: string) => void;
} 