
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('farmer', 'investor', 'collector');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  designation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Residue orders (farmer sells residue)
CREATE TABLE public.residue_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES auth.users(id) NOT NULL,
  residue_type TEXT NOT NULL DEFAULT 'dry',
  weight_kg NUMERIC NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  collector_id UUID REFERENCES auth.users(id),
  pickup_location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.residue_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers view own residue" ON public.residue_orders FOR SELECT USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers create residue" ON public.residue_orders FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Investors view all residue" ON public.residue_orders FOR SELECT USING (public.has_role(auth.uid(), 'investor'));
CREATE POLICY "Collectors view all residue" ON public.residue_orders FOR SELECT USING (public.has_role(auth.uid(), 'collector'));
CREATE POLICY "Collectors update residue" ON public.residue_orders FOR UPDATE USING (public.has_role(auth.uid(), 'collector'));

-- Biochar orders (farmer buys biochar)
CREATE TABLE public.biochar_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES auth.users(id) NOT NULL,
  soil_type TEXT NOT NULL,
  area_acres NUMERIC NOT NULL,
  current_crop TEXT,
  planned_crop TEXT,
  quantity_kg NUMERIC NOT NULL,
  carbon_content_percent NUMERIC NOT NULL DEFAULT 60,
  price_per_kg NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  delivery_location TEXT,
  collector_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.biochar_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers view own biochar" ON public.biochar_orders FOR SELECT USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers create biochar" ON public.biochar_orders FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Investors view all biochar" ON public.biochar_orders FOR SELECT USING (public.has_role(auth.uid(), 'investor'));
CREATE POLICY "Collectors view all biochar" ON public.biochar_orders FOR SELECT USING (public.has_role(auth.uid(), 'collector'));
CREATE POLICY "Collectors update biochar" ON public.biochar_orders FOR UPDATE USING (public.has_role(auth.uid(), 'collector'));
