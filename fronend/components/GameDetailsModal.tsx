'use client';

import { useGame } from '@/context/GameContext';
import { saveGameDetails } from '@/app/actions/game';
import { useEffect, useRef } from 'react';
import { Game } from '@/types/game';
import { X } from 'lucide-react';

interface GameDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameDetailsModal({ isOpen, onClose }: GameDetailsModalProps) {
  const { selectedGame, updateGame } = useGame();
  const formRef = useRef<HTMLFormElement>(null);

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
        onClose();
      } else {
        console.error('Failed to save game details:', result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Game Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form ref={formRef} action={handleSubmit} className="space-y-8">
            {/* Game Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Game Title</label>
              <input
                type="text"
                name="gameTitle"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter game title"
                defaultValue={selectedGame?.title}
              />
            </div>

            {/* Game Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Game Genre</label>
              <select
                name="gameGenre"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                defaultValue={selectedGame?.genre}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
              <input
                type="text"
                name="manualTags"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Add custom tags (comma separated)"
                defaultValue={selectedGame?.manual_tags?.join(', ')}
              />
            </div>

            {/* Game Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Game Description</label>
              <textarea
                name="shortDescription"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows={4}
                placeholder="Enter a description of your game"
                defaultValue={selectedGame?.description}
              />
            </div>

            {/* Do Not Include */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Do Not Include</label>
              <textarea
                name="doNotInclude"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows={4}
                placeholder="Enter elements you do not want to include in the marketing content"
                defaultValue={selectedGame?.do_not_include}
              />
            </div>

            {/* Development Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Development Stage</label>
              <select
                name="developmentStage"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                defaultValue={selectedGame?.development_stage || ''}
              >
                <option value="">Select development stage</option>
                <option value="prototype">Prototype</option>
                <option value="alpha">Alpha</option>
                <option value="beta">Beta</option>
                <option value="release">Release</option>
                <option value="post-launch">Post-launch</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 