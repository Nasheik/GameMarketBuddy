import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GeneratedPost {
  postTitle: string;
  platform: string;
  content: string;
  hashtags: string[];
  bestTime: string;
  mediaSuggestion: string;
}

interface SavedPost extends GeneratedPost {
  localDate: string;
  scheduledTime: string;
}

// Validation function to ensure the response matches our schema
function validatePost(post: any): post is GeneratedPost {
  return (
    typeof post.postTitle === 'string' &&
    typeof post.platform === 'string' &&
    typeof post.content === 'string' &&
    Array.isArray(post.hashtags) &&
    post.hashtags.every((tag: any) => typeof tag === 'string') &&
    typeof post.bestTime === 'string' &&
    typeof post.mediaSuggestion === 'string'
  );
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { gameDetails } = await request.json();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Use cached game details if available, otherwise fetch from database
    let game = gameDetails;
    if (!game) {
      const { data: fetchedGame } = await supabase
        .from('games')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!fetchedGame) {
        throw new Error('No game details found');
      }
      game = fetchedGame;
    }

    const prompt = `Create a week's worth of social media posts for a game with the following details:
Title: ${game.title}
Genre: ${game.genre}${game.manual_tags ? `, ${game.manual_tags}` : ''}
Description: ${game.description}
Target Platforms: Twitter, TikTok
Development Stage: ${game.development_stage}

For each day of the week (Monday through Sunday), provide a JSON object with the following exact structure:
{
  "postTitle": "string (title of the post)",
  "platform": "string (e.g., Twitter, TikTok)",
  "content": "string (the actual post text)",
  "hashtags": ["string", "string", "string"] (3-5 hashtags),
  "bestTime": "string (in EST format like '2:00 PM')",
  "mediaSuggestion": "string (this is the suggested media for the post) (e.g. video of player jump off a building and making it to the other side)"
}

The response must be a valid JSON object with days as keys (Monday, Tuesday, etc.) and the above structure as values. Do not include any additional fields or text outside the JSON object.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a social media marketing expert specializing in game promotion. Create engaging, platform-appropriate content for each day of the week. Your response must be a valid JSON object with the exact structure specified."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const posts = JSON.parse(content) as Record<string, GeneratedPost>;

    // Validate each post
    for (const [day, post] of Object.entries(posts)) {
      if (!validatePost(post)) {
        throw new Error(`Invalid post format for ${day}`);
      }
    }

    // Save each post to the database
    const savedPosts: SavedPost[] = [];
    for (const [day, post] of Object.entries(posts)) {
      // Calculate the date for this day of the week
      const today = new Date();
      const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
      const targetDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
      const daysToAdd = (targetDay - currentDay + 7) % 7;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysToAdd);
      
      // Set the time to 12:00 PM UTC
      targetDate.setHours(12, 0, 0, 0);
      
      // Sanitize mediaSuggestion to remove leading slash if present
      const sanitizedMediaSuggestion = post.mediaSuggestion.startsWith('/')
        ? post.mediaSuggestion.slice(1)
        : post.mediaSuggestion;
      
      const { error } = await supabase
        .from('saved_posts')
        .insert({
          user_id: user.id,
          game_id: game.id,
          title: post.postTitle,
          platform: post.platform,
          content: post.content,
          hashtags: post.hashtags,
          local_date: targetDate.toISOString().split('T')[0],
          time_to_post: targetDate.toISOString(),
          media_suggestion: sanitizedMediaSuggestion
        });

      if (error) {
        console.error(`Error saving post for ${day}:`, error);
        continue;
      }

      savedPosts.push({
        localDate: targetDate.toISOString().split('T')[0],
        scheduledTime: targetDate.toISOString().split('T')[1].split('.')[0],
        ...post
      });
    }

    return NextResponse.json({ posts: savedPosts });
  } catch (error) {
    console.error('Error in generate-posts route:', error);
    return NextResponse.json(
      { error: 'Failed to generate posts' },
      { status: 500 }
    );
  }
} 