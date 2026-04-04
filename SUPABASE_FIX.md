# Supabase SQL Fix

Copy the entire block below and paste it into the **SQL Editor** in your Supabase dashboard, then click **Run**.

```sql
-- 1. FIX EVENTS PERMISSIONS
-- This allows the Admin Dashboard to Create, Update, and Delete events.
DROP POLICY IF EXISTS "Enable insert for all on events" ON public.events;
CREATE POLICY "Enable insert for all on events" ON public.events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for all on events" ON public.events;
CREATE POLICY "Enable update for all on events" ON public.events FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for all on events" ON public.events;
CREATE POLICY "Enable delete access for all users on events" ON public.events FOR DELETE USING (true);

-- 2. FIX PARTICIPANTS PERMISSIONS
-- This allows Admin to manage participants and users to self-register.
DROP POLICY IF EXISTS "Enable update for all on participants" ON public.participants;
CREATE POLICY "Enable update for all on participants" ON public.participants FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for all on participants" ON public.participants;
CREATE POLICY "Enable delete access for all users on participants" ON public.participants FOR DELETE USING (true);

-- 3. ENSURE READ ACCESS IS GLOBAL
DROP POLICY IF EXISTS "Enable read access for all users on events" ON public.events;
CREATE POLICY "Enable read access for all users on events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users on participants" ON public.participants;
CREATE POLICY "Enable read access for all users on participants" ON public.participants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert access for all users on participants" ON public.participants;
CREATE POLICY "Enable insert access for all users on participants" ON public.participants FOR INSERT WITH CHECK (true);
```
