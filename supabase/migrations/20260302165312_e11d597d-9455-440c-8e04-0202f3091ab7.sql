
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Journeys table
CREATE TABLE public.journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own journeys" ON public.journeys
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Journey days table
CREATE TABLE public.journey_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID REFERENCES public.journeys(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  goal TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  journal_entry TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(journey_id, day_number)
);

ALTER TABLE public.journey_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own journey days" ON public.journey_days
  FOR ALL TO authenticated
  USING (journey_id IN (SELECT id FROM public.journeys WHERE user_id = auth.uid()))
  WITH CHECK (journey_id IN (SELECT id FROM public.journeys WHERE user_id = auth.uid()));

-- Day photos table
CREATE TABLE public.day_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_day_id UUID REFERENCES public.journey_days(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.day_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own day photos" ON public.day_photos
  FOR ALL TO authenticated
  USING (journey_day_id IN (
    SELECT jd.id FROM public.journey_days jd
    JOIN public.journeys j ON j.id = jd.journey_id
    WHERE j.user_id = auth.uid()
  ))
  WITH CHECK (journey_day_id IN (
    SELECT jd.id FROM public.journey_days jd
    JOIN public.journeys j ON j.id = jd.journey_id
    WHERE j.user_id = auth.uid()
  ));

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('journey-photos', 'journey-photos', true);

CREATE POLICY "Users can upload own photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'journey-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view journey photos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'journey-photos');

CREATE POLICY "Users can delete own photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'journey-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
