
-- Roles infrastructure
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Replace permissive authenticated policies with admin-only ones
DROP POLICY "Authenticated users can view bookings" ON public.bookings;
DROP POLICY "Authenticated users can update bookings" ON public.bookings;
CREATE POLICY "Admins can view bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete bookings" ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Authenticated users can read all feedback" ON public.feedback;
DROP POLICY "Authenticated users can update feedback" ON public.feedback;
DROP POLICY "Authenticated users can delete feedback" ON public.feedback;
CREATE POLICY "Admins can read all feedback" ON public.feedback FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update feedback" ON public.feedback FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete feedback" ON public.feedback FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Authenticated users can view inquiries" ON public.contact_inquiries;
DROP POLICY "Authenticated users can update inquiries" ON public.contact_inquiries;
CREATE POLICY "Admins can view inquiries" ON public.contact_inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update inquiries" ON public.contact_inquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete inquiries" ON public.contact_inquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
