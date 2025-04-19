import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const gameName = formData.get('gameName') as string;
    const gameDescription = formData.get('gameDescription') as string;
    const genre = formData.get('genre') as string;
    const releaseStatus = formData.get('releaseStatus') as string;
    const manualTags = formData.get('manualTags') as string;
    const targetPlatforms = formData.getAll('targetPlatforms') as string[];
    const marketingPlatforms = formData.getAll('marketingPlatforms') as string[];
    const marketingGoals = formData.get('marketingGoals') as string;
    const toneAndStyle = formData.get('toneAndStyle') as string;

    // Validate required fields
    if (!gameName || !gameDescription || !genre || !releaseStatus) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert game into database
    const { data: game, error } = await supabase
      .from('games')
      .insert([
        {
          title: gameName,
          description: gameDescription,
          genre,
          development_stage: releaseStatus,
          user_id: session.user.id,
          manual_tags: manualTags ? manualTags.split(',').map(tag => tag.trim()) : [],
          target_platforms: targetPlatforms,
          marketing_platforms: marketingPlatforms,
          marketing_goals: marketingGoals,
          tone_and_style: toneAndStyle,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating game:', error);
      return NextResponse.json(
        { error: "Failed to create game" },
        { status: 500 }
      );
    }

    // Redirect to dashboard after successful creation
    return NextResponse.json(
      { message: "Game created successfully", game },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in game creation:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 