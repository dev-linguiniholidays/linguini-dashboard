-- Schema setup for Linguini Holidays CRM (ClientView360)
-- Copy and paste this script into your Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create public.users Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('admin', 'user', 'superadmin')) NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create public.customers Table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  destination TEXT,
  status TEXT CHECK (status IN ('fresh', 'no-response', 'ongoing', 'converted', 'dead', 'future', 'hot')) NOT NULL DEFAULT 'fresh',
  description TEXT,
  travel_start_date DATE,
  travel_end_date DATE,
  lead_creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  number_of_pax INTEGER NOT NULL DEFAULT 1 CHECK (number_of_pax >= 0),
  lead_type TEXT CHECK (lead_type IN ('calling', 'instagram', 'referral', 'website', 'facebook', 'walk-in', 'other')) NOT NULL DEFAULT 'other',
  service TEXT CHECK (service IN ('tour-package', 'flight', 'train', 'visa', 'group-departure', 'bus', 'cab', 'hotel')) NOT NULL DEFAULT 'tour-package',
  assignee TEXT NOT NULL DEFAULT 'none',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create public.customer_comments Table
CREATE TABLE IF NOT EXISTS public.customer_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  user_id TEXT NOT NULL, -- UUID string or user name/id from auth
  user_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_comments ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Users policies
CREATE POLICY "Allow read access to all authenticated users on users table"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for users themselves"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow update for users themselves or admins"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin')
  WITH CHECK (auth.uid() = id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Customers policies
CREATE POLICY "Allow all actions for authenticated users on customers table"
  ON public.customers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Customer comments policies
CREATE POLICY "Allow all actions for authenticated users on comments table"
  ON public.customer_comments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Trigger: Sync Supabase Auth Users to public.users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', SPLIT_PART(new.email, '@', 1)),
    new.email,
    'user' -- Default role, can be upgraded to 'admin' manually in the database
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Modifications for Bookings support
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS is_locked BOOLEAN NOT NULL DEFAULT false;

-- Create public.bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  destination TEXT,
  status TEXT CHECK (status IN ('fresh', 'no-response', 'ongoing', 'converted', 'dead', 'future', 'hot')) NOT NULL DEFAULT 'fresh',
  description TEXT,
  travel_start_date DATE,
  travel_end_date DATE,
  lead_creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  number_of_pax INTEGER NOT NULL DEFAULT 1 CHECK (number_of_pax >= 0),
  lead_type TEXT CHECK (lead_type IN ('calling', 'instagram', 'referral', 'website', 'facebook', 'walk-in', 'other')) NOT NULL DEFAULT 'other',
  service TEXT CHECK (service IN ('tour-package', 'flight', 'train', 'visa', 'group-departure', 'bus', 'cab', 'hotel')) NOT NULL DEFAULT 'tour-package',
  assignee TEXT NOT NULL DEFAULT 'none',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create public.booking_comments Table
CREATE TABLE IF NOT EXISTS public.booking_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_comments ENABLE ROW LEVEL SECURITY;

-- Bookings policies
DROP POLICY IF EXISTS "Allow read access to all authenticated users on bookings table" ON public.bookings;
CREATE POLICY "Allow read access to all authenticated users on bookings table"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow insert for admins and superadmins" ON public.bookings;
CREATE POLICY "Allow insert for admins and superadmins"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'superadmin')
  );

DROP POLICY IF EXISTS "Allow update for admins and superadmins on bookings" ON public.bookings;
CREATE POLICY "Allow update for admins and superadmins on bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'superadmin')
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'superadmin')
  );

DROP POLICY IF EXISTS "Allow delete for superadmins on bookings" ON public.bookings;
CREATE POLICY "Allow delete for superadmins on bookings"
  ON public.bookings FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'superadmin'
  );

-- Booking comments policies
DROP POLICY IF EXISTS "Allow all actions for authenticated users on booking comments table" ON public.booking_comments;
CREATE POLICY "Allow all actions for authenticated users on booking comments table"
  ON public.booking_comments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 8. Alter bookings table status constraints & add package_cost
-- Update any existing bookings with older status values (e.g. 'converted', 'fresh') to 'upcoming' so the new constraint isn't violated
UPDATE public.bookings 
SET status = 'upcoming' 
WHERE status NOT IN ('upcoming', 'ongoing', 'postponed', 'cancelled', 'completed');

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check CHECK (status IN ('upcoming', 'ongoing', 'postponed', 'cancelled', 'completed'));
ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'upcoming';

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS package_cost NUMERIC NOT NULL DEFAULT 0;

-- Create public.booking_expenses Table
CREATE TABLE IF NOT EXISTS public.booking_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  category TEXT CHECK (category IN ('Hotel', 'Taxi', 'Bus', 'Guide', 'Travel Hamper', 'Medical Kit', 'Misc.')) NOT NULL,
  description TEXT,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.booking_expenses ENABLE ROW LEVEL SECURITY;

-- booking_expenses policies
DROP POLICY IF EXISTS "Allow read access to all authenticated users on booking expenses table" ON public.booking_expenses;
CREATE POLICY "Allow read access to all authenticated users on booking expenses table"
  ON public.booking_expenses FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow all actions for admins and superadmins on booking expenses" ON public.booking_expenses;
CREATE POLICY "Allow all actions for admins and superadmins on booking expenses"
  ON public.booking_expenses FOR ALL
  TO authenticated
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'superadmin'))
  WITH CHECK ((SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'superadmin'));

-- 9. Remove package_type column from customers and bookings tables
ALTER TABLE public.customers DROP COLUMN IF EXISTS package_type;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS package_type;
