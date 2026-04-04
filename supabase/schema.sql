-- Run this entire script in your Supabase SQL Editor

-- 1. Create Events Table
CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    event_date date NOT NULL,
    event_time time without time zone,
    venue_name text NOT NULL,
    venue_address text NOT NULL,
    event_type text DEFAULT 'seminar',
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Participants Table
CREATE TABLE public.participants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
    name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    whatsapp_number text,
    area_name text NOT NULL,
    pincode text NOT NULL,
    full_address text,
    latitude double precision,
    longitude double precision,
    linkedin_url text,
    is_offering_ride boolean DEFAULT false,
    seats_available integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set up Row Level Security (RLS)

-- Enable RLS on both tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Enable read access for all users on events
CREATE POLICY "Enable read access for all users on events" ON public.events
    FOR SELECT USING (true);

-- Enable insert access for all users on events (Admin operations)
CREATE POLICY "Enable insert access for all users on events" ON public.events
    FOR INSERT WITH CHECK (true);

-- Enable update access for all users on events (Admin operations)
CREATE POLICY "Enable update access for all users on events" ON public.events
    FOR UPDATE USING (true);

-- Enable delete access for all users on events (Admin operations)
CREATE POLICY "Enable delete access for all users on events" ON public.events
    FOR DELETE USING (true);

-- Participants: Anyone can read
CREATE POLICY "Enable read access for all users on participants" ON public.participants
    FOR SELECT USING (true);

-- Participants: Anyone can insert (self-registration)
CREATE POLICY "Enable insert access for all users on participants" ON public.participants
    FOR INSERT WITH CHECK (true);

-- Enable update access for all users on participants (Admin operations)
CREATE POLICY "Enable update access for all users on participants" ON public.participants
    FOR UPDATE USING (true);

-- Enable delete access for all users on participants (Admin operations)
CREATE POLICY "Enable delete access for all users on participants" ON public.participants
    FOR DELETE USING (true);

-- The backend API using the Supabase Service Role key will bypass RLS for admin operations.

-- 4. Enable PostGIS (Optional, but good if you want to do DB-level radius searches later)
-- CREATE EXTENSION postgis;
