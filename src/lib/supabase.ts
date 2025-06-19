import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Profile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'owner' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ParkingSpot {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  total_slots: number;
  available_slots: number;
  price: number;
  price_type: string;
  amenities: string[];
  images: string[];
  operating_hours: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  owner?: Profile;
  rating?: number;
  review_count?: number;
}

export interface Vehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  license_plate: string;
  color: string;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  spot_id: string;
  vehicle_id?: string;
  start_time: string;
  end_time: string;
  total_cost: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  payment_method?: 'qr_code' | 'bank_transfer';
  payment_status: 'pending' | 'verified' | 'rejected';
  qr_code: string;
  pin: string;
  confirmed_at?: string;
  created_at: string;
  updated_at: string;
  spot?: ParkingSpot;
  vehicle?: Vehicle;
  user?: Profile;
}

export interface PaymentMethod {
  id: string;
  owner_id: string;
  type: 'qr_code' | 'bank_transfer';
  qr_code_url?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentSlip {
  id: string;
  booking_id: string;
  image_url: string;
  status: 'pending' | 'verified' | 'rejected';
  verified_by?: string;
  verified_at?: string;
  notes?: string;
  created_at: string;
  booking?: Booking;
}

export interface Review {
  id: string;
  booking_id: string;
  user_id: string;
  spot_id: string;
  rating: number;
  comment?: string;
  photos: string[];
  is_anonymous: boolean;
  created_at: string;
  user?: Profile;
  spot?: ParkingSpot;
}

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
};

// Storage helpers
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};