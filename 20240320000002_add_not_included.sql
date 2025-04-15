-- Add not_included column to games table
ALTER TABLE public.games
ADD COLUMN IF NOT EXISTS not_included TEXT; 