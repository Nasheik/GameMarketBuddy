import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const prompt = `Create marketing content for a game with the following details:
Title: ${body.gameTitle}
Genre: ${body.gameGenre}${body.manualTags ? `, ${body.manualTags}` : ''}
Description: ${body.shortDescription}
Target Platforms: ${body.targetPlatforms.join(', ')}
Marketing Platforms: ${body.marketingPlatforms.join(', ')}
Development Stage: ${body.developmentStage}
Marketing Goals: ${body.marketingGoals}
Tone and Style: ${body.toneAndStyle}

Limit the content to 7 days and only output the content for each day, no other text.

Please generate engaging marketing content that aligns with the specified tone and style, focusing on the marketing goals and appropriate for the development stage.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are a marketing expert who helps indie game developers promote their games online. Based on the game details provided below, generate a 7-day social media content plan tailored to this game.\n\nFor each day, provide:\n-A social media post idea\n-The goal of the post (e.g., engagement, awareness, wishlist conversions)\n-Suggested format (e.g., image, video, text, poll)\n-A sample caption or hook\n\nMake sure the content feels authentic and relatable for indie developers. It should be suitable for platforms like Twitter/X, Instagram, TikTok, and LinkedIn."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
      top_p: 1.0,
      max_tokens: 800,
      frequency_penalty: 0.3,
      presence_penalty: 0.6,
      stop: null
    });

    return NextResponse.json({ 
      content: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 