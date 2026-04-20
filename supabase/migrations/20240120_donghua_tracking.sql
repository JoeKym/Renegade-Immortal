-- Migration: Donghua Progress Tracking System
-- Description: Creates tables for tracking donghua episodes, arcs, and adaptation progress

-- Create donghua_arcs table
CREATE TABLE IF NOT EXISTS public.donghua_arcs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    episode_start INTEGER NOT NULL,
    episode_end INTEGER NOT NULL,
    chapter_start INTEGER NOT NULL,
    chapter_end INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'now_airing', 'upcoming')),
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donghua_progress table (single row for global progress)
CREATE TABLE IF NOT EXISTS public.donghua_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    current_episode INTEGER NOT NULL DEFAULT 128,
    total_episodes INTEGER NOT NULL DEFAULT 350,
    current_chapter INTEGER NOT NULL DEFAULT 850,
    total_chapters INTEGER NOT NULL DEFAULT 2100,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donghua_episodes table for detailed episode tracking
CREATE TABLE IF NOT EXISTS public.donghua_episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_number INTEGER NOT NULL UNIQUE,
    chapter_start INTEGER,
    chapter_end INTEGER,
    air_date DATE,
    status TEXT NOT NULL CHECK (status IN ('aired', 'upcoming')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_donghua_arcs_order ON public.donghua_arcs(order_index);
CREATE INDEX IF NOT EXISTS idx_donghua_arcs_status ON public.donghua_arcs(status);
CREATE INDEX IF NOT EXISTS idx_donghua_episodes_number ON public.donghua_episodes(episode_number);
CREATE INDEX IF NOT EXISTS idx_donghua_episodes_status ON public.donghua_episodes(status);

-- Enable Row Level Security
ALTER TABLE public.donghua_arcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donghua_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donghua_episodes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to donghua_arcs"
    ON public.donghua_arcs
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access to donghua_progress"
    ON public.donghua_progress
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access to donghua_episodes"
    ON public.donghua_episodes
    FOR SELECT
    TO public
    USING (true);

-- Create policies for admin write access
CREATE POLICY "Allow admin write access to donghua_arcs"
    ON public.donghua_arcs
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Allow admin write access to donghua_progress"
    ON public.donghua_progress
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Allow admin write access to donghua_episodes"
    ON public.donghua_episodes
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Insert default arcs data
INSERT INTO public.donghua_arcs (name, description, episode_start, episode_end, chapter_start, chapter_end, status, order_index)
VALUES 
    ('Ji Realm Awakening', 'Wang Lin begins his cultivation journey in the Ji Realm, discovering his talent and facing early challenges.', 1, 50, 1, 250, 'completed', 1),
    ('Underworld & Corporeal Realm', 'Wang Lin ventures into the underworld and establishes his foundation in the Corporeal Realm.', 51, 100, 251, 600, 'completed', 2),
    ('Ancient God Lands', 'Wang Lin explores the Ancient God Lands, gaining powerful inheritance and facing deadly trials.', 101, 150, 601, 1000, 'now_airing', 3),
    ('Dao Expansion & Alliances', 'Wang Lin expands his dao and forms crucial alliances for the battles ahead.', 151, 200, 1001, 1400, 'upcoming', 4),
    ('Heaven-Defying Ascension', 'Wang Lin ascends to higher realms, defying the heavens and challenging fate itself.', 201, 250, 1401, 1800, 'upcoming', 5),
    ('Final Confrontation', 'The ultimate battle for Wang Lin to become the True Renegade Immortal.', 251, 350, 1801, 2100, 'upcoming', 6)
ON CONFLICT (id) DO NOTHING;

-- Insert initial progress data (single row)
INSERT INTO public.donghua_progress (current_episode, total_episodes, current_chapter, total_chapters)
VALUES (128, 350, 850, 2100)
ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_donghua_arcs_updated_at ON public.donghua_arcs;
CREATE TRIGGER update_donghua_arcs_updated_at
    BEFORE UPDATE ON public.donghua_arcs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
