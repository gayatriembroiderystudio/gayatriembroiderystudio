
-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  service_type TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  address TEXT,
  design_requirements TEXT,
  reference_image_url TEXT,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a booking" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can view bookings" ON public.bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update bookings" ON public.bookings FOR UPDATE TO authenticated USING (true);

-- Feedback
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL,
  image_url TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.feedback TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit feedback" ON public.feedback FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read approved feedback" ON public.feedback FOR SELECT TO anon USING (approved = true);
CREATE POLICY "Authenticated users can read all feedback" ON public.feedback FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update feedback" ON public.feedback FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete feedback" ON public.feedback FOR DELETE TO authenticated USING (true);

-- contact_messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  mobile TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an inquiry" ON public.ccontact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can view inquiries" ON public.contact_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update inquiries" ON public.contact_messages FOR UPDATE TO authenticated USING (true);
