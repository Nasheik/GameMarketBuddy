-- Create users table that extends Supabase Auth
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create games table
CREATE TABLE IF NOT EXISTS public.games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    description TEXT,
    manual_tags TEXT[],
    target_platforms TEXT[] NOT NULL,
    marketing_platforms TEXT[] NOT NULL,
    development_stage TEXT NOT NULL,
    marketing_goals TEXT NOT NULL,
    tone_and_style TEXT NOT NULL,
    short_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create saved_posts table
CREATE TABLE IF NOT EXISTS public.saved_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    day_of_week TEXT NOT NULL,
    post_type TEXT NOT NULL,
    platform TEXT NOT NULL,
    content TEXT NOT NULL,
    hashtags TEXT[] NOT NULL,
    best_time TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_games_user_id ON public.games(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_user_id ON public.saved_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_game_id ON public.saved_posts(game_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_day_of_week ON public.saved_posts(day_of_week);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Games policies
CREATE POLICY "Users can view their own games"
    ON public.games FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own games"
    ON public.games FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own games"
    ON public.games FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own games"
    ON public.games FOR DELETE
    USING (auth.uid() = user_id);

-- Saved posts policies
CREATE POLICY "Users can view their own saved posts"
    ON public.saved_posts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved posts"
    ON public.saved_posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved posts"
    ON public.saved_posts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved posts"
    ON public.saved_posts FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON public.games
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saved_posts_updated_at
    BEFORE UPDATE ON public.saved_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user(); 