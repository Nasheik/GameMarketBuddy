'use server';

import { createClient } from '@/utils/supabase/server';

export async function saveGameDetails(formData: FormData, gameId?: string) {
  const supabase = await createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const gameData = {
      user_id: user.id,
      title: formData.get('gameTitle'),
      genre: formData.get('gameGenre'),
      manual_tags: formData.get('manualTags') ? (formData.get('manualTags') as string).split(',').map(tag => tag.trim()) : [],
      description: formData.get('shortDescription'),
      target_platforms: Array.from(formData.getAll('targetPlatforms')),
      marketing_platforms: Array.from(formData.getAll('marketingPlatforms')),
      development_stage: formData.get('developmentStage'),
      marketing_goals: formData.get('marketingGoals'),
      tone_and_style: formData.get('toneAndStyle'),
    };

    if (gameId) {
      // Update existing game
      const { error } = await supabase
        .from('games')
        .update(gameData)
        .eq('id', gameId);
      
      if (error) throw error;
    } else {
      // Create new game
      const { error } = await supabase
        .from('games')
        .insert(gameData);
      
      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving game details:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
  }
} 