'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Game } from '@/types/game';

interface GameContextType {
  selectedGame: Game | null;
  games: Game[];
  setSelectedGame: (game: Game) => void;
  updateGame: (gameId: string, updatedGame: Partial<Game>) => void;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchGames() {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .order('title');

        if (error) throw error;

        setGames(data || []);
        if (data && data.length > 0) {
          setSelectedGame(data[0]);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGames();
  }, []);

  const updateGame = (gameId: string, updatedGame: Partial<Game>) => {
    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId ? { ...game, ...updatedGame } : game
      )
    );
    
    if (selectedGame?.id === gameId) {
      setSelectedGame(prev => prev ? { ...prev, ...updatedGame } : null);
    }
  };

  return (
    <GameContext.Provider value={{ selectedGame, games, setSelectedGame, updateGame, isLoading }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 