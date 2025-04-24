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
      if (titleInput) titleInput.value = selectedGame.title || '';

      const genreSelect = form.elements.namedItem('gameGenre') as HTMLSelectElement;
      if (genreSelect) genreSelect.value = selectedGame.genre || '';

      const tagsInput = form.elements.namedItem('manualTags') as HTMLInputElement;
      if (tagsInput) tagsInput.value = selectedGame.manual_tags?.join(', ') || '';

      const descriptionTextarea = form.elements.namedItem('shortDescription') as HTMLTextAreaElement;
      if (descriptionTextarea) descriptionTextarea.value = selectedGame.description || '';

      const doNotIncludeTextarea = form.elements.namedItem('doNotInclude') as HTMLTextAreaElement;
      if (doNotIncludeTextarea) doNotIncludeTextarea.value = selectedGame.do_not_include || '';

      const developmentStageSelect = form.elements.namedItem('developmentStage') as HTMLSelectElement;
      if (developmentStageSelect) developmentStageSelect.value = selectedGame.development_stage || '';
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
          development_stage: formData.get('developmentStage')?.toString() || '',
          do_not_include: formData.get('doNotInclude')?.toString() || '',
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
      <div className="max-w-7xl mx-auto p-8">
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

          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Basic Game Info */}
            <div className="space-y-8">
              {/* Game Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Game Genre</label>
                <select
                  name="gameGenre"
                  required
                  className="w-full px-3 py-2 border rounded-md"
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
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  name="manualTags"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Add custom tags (comma separated)"
                  defaultValue={selectedGame.manual_tags?.join(', ')}
                />
              </div>

              {/* Development Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Development Stage</label>
                <select
                  name="developmentStage"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue={selectedGame.development_stage || ''}
                >
                  <option value="">Select development stage</option>
                  <option value="prototype">Prototype</option>
                  <option value="alpha">Alpha</option>
                  <option value="beta">Beta</option>
                  <option value="release">Release</option>
                  <option value="post-launch">Post-launch</option>
                </select>
              </div>
            </div>

            {/* Right Column - Description Fields */}
            <div className="space-y-8">
              {/* Game Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Game Description</label>
                <textarea
                  name="shortDescription"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="Enter a description of your game"
                  defaultValue={selectedGame.description}
                />
              </div>

              {/* Do Not Include */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Do Not Include</label>
                <textarea
                  name="doNotInclude"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="Enter elements you do not want to include in the marketing content"
                  defaultValue={selectedGame.do_not_include}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
