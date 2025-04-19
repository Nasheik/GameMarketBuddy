'use client';

import { useGame } from '@/context/GameContext';
import { saveGameDetails } from '@/app/actions/game';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Game } from '@/types/game';

export default function GameDetails() {
  const { selectedGame, updateGame } = useGame();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (selectedGame && formRef.current) {
      // Update form values when selected game changes
      const form = formRef.current;
      
      // Update text inputs
      const titleInput = form.elements.namedItem('gameTitle') as HTMLInputElement;
      if (titleInput) titleInput.value = selectedGame.title;

      const genreSelect = form.elements.namedItem('gameGenre') as HTMLSelectElement;
      if (genreSelect) genreSelect.value = selectedGame.genre;

      const tagsInput = form.elements.namedItem('manualTags') as HTMLInputElement;
      if (tagsInput) tagsInput.value = selectedGame.manual_tags?.join(', ') || '';

      const descriptionTextarea = form.elements.namedItem('shortDescription') as HTMLTextAreaElement;
      if (descriptionTextarea) descriptionTextarea.value = selectedGame.description || '';
      
      // Update multiple select values
      const targetPlatforms = form.elements.namedItem('targetPlatforms') as HTMLSelectElement;
      if (targetPlatforms) {
        Array.from(targetPlatforms.options).forEach(option => {
          option.selected = selectedGame.target_platforms?.includes(option.value) || false;
        });
      }

      const marketingPlatforms = form.elements.namedItem('marketingPlatforms') as HTMLSelectElement;
      if (marketingPlatforms) {
        Array.from(marketingPlatforms.options).forEach(option => {
          option.selected = selectedGame.marketing_platforms?.includes(option.value) || false;
        });
      }

      const developmentStageSelect = form.elements.namedItem('developmentStage') as HTMLSelectElement;
      if (developmentStageSelect) developmentStageSelect.value = selectedGame.development_stage || '';

      const marketingGoalsInput = form.elements.namedItem('marketingGoals') as HTMLInputElement;
      if (marketingGoalsInput) marketingGoalsInput.value = selectedGame.marketing_goals || '';

      const toneAndStyleSelect = form.elements.namedItem('toneAndStyle') as HTMLSelectElement;
      if (toneAndStyleSelect) toneAndStyleSelect.value = selectedGame.tone_and_style || '';
    }
  }, [selectedGame]);

  const handleSubmit = async (formData: FormData) => {
    if (!selectedGame?.id) {
      console.error('No game selected');
      return;
    }

    try {
      const result = await saveGameDetails(formData, selectedGame.id);
      if (result.success) {
        // Update the game in context with the new data
        const updatedGame: Partial<Game> = {
          title: formData.get('gameTitle')?.toString() || '',
          genre: formData.get('gameGenre')?.toString() || '',
          manual_tags: formData.get('manualTags') ? (formData.get('manualTags') as string).split(',').map(tag => tag.trim()) : [],
          description: formData.get('shortDescription')?.toString() || '',
          target_platforms: Array.from(formData.getAll('targetPlatforms')).map(value => value.toString()),
          marketing_platforms: Array.from(formData.getAll('marketingPlatforms')).map(value => value.toString()),
          development_stage: formData.get('developmentStage')?.toString() || '',
          marketing_goals: formData.get('marketingGoals')?.toString() || '',
          tone_and_style: formData.get('toneAndStyle')?.toString() || '',
        };
        updateGame(selectedGame.id, updatedGame);
        router.push('/dashboard');
      } else {
        console.error('Failed to save game details:', result.error);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // You might want to show an error message to the user here
    }
  };

  if (!selectedGame) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No game selected. Please select a game from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Game Details</h1>
        
        <form ref={formRef} action={handleSubmit} className="space-y-8">
          {/* Game Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Game Title</label>
            <input
              type="text"
              name="gameTitle"
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter game title"
              defaultValue={selectedGame.title}
            />
          </div>

          {/* Game Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Game Genre</label>
            <select
              name="gameGenre"
              required
              className="w-full px-3 py-2 border rounded-md mb-2"
              defaultValue={selectedGame.genre}
            >
              <option value="">Select a genre</option>
              <option value="action">Action</option>
              <option value="adventure">Adventure</option>
              <option value="rpg">RPG</option>
              <option value="strategy">Strategy</option>
              <option value="simulation">Simulation</option>
              <option value="puzzle">Puzzle</option>
              <option value="platformer">Platformer</option>
              <option value="shooter">Shooter</option>
            </select>
            <input
              type="text"
              name="manualTags"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Add custom tags (comma separated)"
              defaultValue={selectedGame.manual_tags?.join(', ')}
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Game Description</label>
            <textarea
              name="shortDescription"
              required
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
              placeholder="Enter a brief description of your game"
              defaultValue={selectedGame.description}
            />
          </div>

          {/* Target Platforms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Platforms</label>
            <select
              name="targetPlatforms"
              multiple
              required
              className="w-full px-3 py-2 border rounded-md"
              defaultValue={selectedGame.target_platforms}
            >
              <option value="steam">Steam</option>
              <option value="itch">itch.io</option>
              <option value="epic">Epic Games Store</option>
              <option value="gog">GOG</option>
              <option value="console">Console</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          {/* Marketing Platforms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Platforms</label>
            <select
              name="marketingPlatforms"
              multiple
              required
              className="w-full px-3 py-2 border rounded-md"
              defaultValue={selectedGame.marketing_platforms}
            >
              <option value="twitter">Twitter</option>
              <option value="reddit">Reddit</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="discord">Discord</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          {/* Development Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Development Stage</label>
            <select
              name="developmentStage"
              required
              className="w-full px-3 py-2 border rounded-md"
              defaultValue={selectedGame.development_stage}
            >
              <option value="">Select development stage</option>
              <option value="prototype">Prototype</option>
              <option value="alpha">Alpha</option>
              <option value="beta">Beta</option>
              <option value="release">Release</option>
              <option value="post-launch">Post-launch</option>
            </select>
          </div>

          {/* Marketing Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Goals</label>
            <input
              type="text"
              name="marketingGoals"
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., Wishlist growth, Devlog visibility, Community engagement"
              defaultValue={selectedGame.marketing_goals}
            />
          </div>

          {/* Tone and Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tone and Style</label>
            <select
              name="toneAndStyle"
              required
              className="w-full px-3 py-2 border rounded-md"
              defaultValue={selectedGame.tone_and_style}
            >
              <option value="">Select tone and style</option>
              <option value="casual">Casual</option>
              <option value="hype">Hype</option>
              <option value="devlog">Devlog</option>
              <option value="inspirational">Inspirational</option>
              <option value="professional">Professional</option>
              <option value="humorous">Humorous</option>
            </select>
          </div>

          {/* Save Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-500 transition-colors font-medium"
            >
              Update Game Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
