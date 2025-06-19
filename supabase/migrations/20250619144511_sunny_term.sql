/*
  # Initial Database Schema for ParkPass

  1. New Tables
    - `profiles` - User profiles with role-based access
    - `parking_spots` - Parking spot listings with location data
    - `vehicles` - User vehicle information
    - `bookings` - Parking reservations and bookings
    - `payment_methods` - Owner payment configuration
    - `payment_slips` - User payment slip uploads
    - `reviews` - Booking reviews and ratings
    - `availability_blocks` - Time-based availability management

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure file uploads for images and payment slips

  3. Functions
    - Auto-create profile on user signup
    - Generate unique booking codes and PINs
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'owner', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE payment_method_type AS ENUM ('qr_code', 'bank_transfer');
CREATE TYPE availability_status AS ENUM ('available', 'blocked', 'maintenance');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  role user_role DEFAULT 'user',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Parking spots table
CREATE TABLE IF NOT EXISTS parking_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  address text NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  total_slots integer NOT NULL DEFAULT 1,
  available_slots integer NOT NULL DEFAULT 1,
  price decimal(10, 2) NOT NULL,
  price_type text NOT NULL DEFAULT 'hour',
  amenities text[] DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  operating_hours jsonb DEFAULT '{"24_7": true}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_slots CHECK (available_slots <= total_slots AND available_slots >= 0),
  CONSTRAINT valid_price CHECK (price > 0),
  CONSTRAINT valid_images CHECK (array_length(images, 1) >= 1 AND array_length(images, 1) <= 3)
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  license_plate text NOT NULL,
  color text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, license_plate)
);

-- Payment methods table (for owners)
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type payment_method_type NOT NULL,
  qr_code_url text,
  bank_name text,
  account_number text,
  account_name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  spot_id uuid REFERENCES parking_spots(id) ON DELETE CASCADE NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  total_cost decimal(10, 2) NOT NULL,
  status booking_status DEFAULT 'pending',
  payment_method payment_method_type,
  payment_status payment_status DEFAULT 'pending',
  qr_code text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  pin text NOT NULL DEFAULT lpad(floor(random() * 10000)::text, 4, '0'),
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_booking_time CHECK (end_time > start_time),
  CONSTRAINT valid_cost CHECK (total_cost > 0)
);

-- Payment slips table
CREATE TABLE IF NOT EXISTS payment_slips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  status payment_status DEFAULT 'pending',
  verified_by uuid REFERENCES profiles(id),
  verified_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(booking_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  spot_id uuid REFERENCES parking_spots(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  photos text[] DEFAULT '{}',
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(booking_id)
);

-- Availability blocks table
CREATE TABLE IF NOT EXISTS availability_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id uuid REFERENCES parking_spots(id) ON DELETE CASCADE NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status availability_status NOT NULL,
  reason text,
  slots_affected integer NOT NULL DEFAULT 1,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_block_time CHECK (end_time > start_time)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_blocks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Parking spots policies
CREATE POLICY "Anyone can read active parking spots"
  ON parking_spots FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Owners can manage their spots"
  ON parking_spots FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can read all spots"
  ON parking_spots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Vehicles policies
CREATE POLICY "Users can manage their vehicles"
  ON vehicles FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Payment methods policies
CREATE POLICY "Owners can manage their payment methods"
  ON payment_methods FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

-- Bookings policies
CREATE POLICY "Users can read their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their pending bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Spot owners can read bookings for their spots"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parking_spots 
      WHERE id = spot_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Spot owners can update booking status"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parking_spots 
      WHERE id = spot_id AND owner_id = auth.uid()
    )
  );

-- Payment slips policies
CREATE POLICY "Users can manage slips for their bookings"
  ON payment_slips FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Spot owners can read slips for their spots"
  ON payment_slips FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN parking_spots ps ON b.spot_id = ps.id
      WHERE b.id = booking_id AND ps.owner_id = auth.uid()
    )
  );

CREATE POLICY "Spot owners can verify payment slips"
  ON payment_slips FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN parking_spots ps ON b.spot_id = ps.id
      WHERE b.id = booking_id AND ps.owner_id = auth.uid()
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  TO authenticated;

CREATE POLICY "Users can create reviews for their completed bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id AND user_id = auth.uid() AND status = 'completed'
    )
  );

-- Availability blocks policies
CREATE POLICY "Anyone can read availability blocks"
  ON availability_blocks FOR SELECT
  TO authenticated;

CREATE POLICY "Spot owners can manage availability blocks"
  ON availability_blocks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parking_spots 
      WHERE id = spot_id AND owner_id = auth.uid()
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update parking spot rating
CREATE OR REPLACE FUNCTION update_spot_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE parking_spots 
  SET updated_at = now()
  WHERE id = NEW.spot_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update spot when review is added
CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_spot_rating();

-- Function to generate unique booking codes
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS text AS $$
BEGIN
  RETURN 'PB' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(gen_random_uuid()::text, 1, 8));
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_parking_spots_location ON parking_spots USING GIST (ST_Point(longitude, latitude));
CREATE INDEX IF NOT EXISTS idx_parking_spots_owner ON parking_spots(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_spot ON bookings(spot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_spot ON reviews(spot_id);
CREATE INDEX IF NOT EXISTS idx_availability_blocks_spot ON availability_blocks(spot_id);