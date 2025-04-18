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
          name: gameName,
          description: gameDescription,
          genre,
          release_status: releaseStatus,
          user_id: session.user.id,
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