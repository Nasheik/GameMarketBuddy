export interface Post {
    id: string;
    title: string;
    content: string;
    platform: 'Twitter' | 'YouTube' | 'Discord' | 'Steam' | 'TikTok' | 'Email';
    scheduledDate: Date;
    status: 'draft' | 'scheduled' | 'published';
    metrics?: {
      impressions: number;
      engagement: number;
      clicks: number;
    };
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    accounts: {
      platform: string;
      connected: boolean;
      username?: string;
    }[];
  }