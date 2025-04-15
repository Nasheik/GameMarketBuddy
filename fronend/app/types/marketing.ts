export interface GameDetails {
  title: string;
  description: string;
  genre: string;
  platforms: string[];
  releaseDate?: string;
  price?: number;
  features?: string[];
  targetAudience?: string[];
}

export interface MarketingPreferences {
  tone: 'casual' | 'professional' | 'enthusiastic' | 'humorous';
  platforms: string[];
  keyPoints: string[];
  callToAction?: string;
}

export interface GeneratedPosts {
  [platform: string]: string;
} 