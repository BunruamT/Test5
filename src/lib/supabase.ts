import { createClient } from '@supabase/supabase-js';

// For development, we'll use placeholder values that won't break the app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'; 

// Check if we're using placeholder/mock values
const isUsingMockClient = 
  !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl === 'https://your-project.supabase.co' ||
  supabaseUrl === 'https://placeholder.supabase.co' ||
  supabaseAnonKey === 'your-anon-key-here' ||
  supabaseAnonKey === 'placeholder-key';

// Create a mock client if no real credentials are provided
const createSupabaseClient = () => {
  if (isUsingMockClient) {
    console.warn('⚠️ Using mock Supabase client. Please set up your Supabase credentials in .env file');
    
    // Return a mock client for development
    return {
      auth: {
        signUp: async ({ email, password, options }: any) => {
          console.log('Mock signUp:', { email, password, options });
          // Simulate successful signup
          return { 
            data: { 
              user: { 
                id: 'mock-user-id', 
                email, 
                user_metadata: options?.data || {} 
              }, 
              session: {
                user: { 
                  id: 'mock-user-id', 
                  email, 
                  user_metadata: options?.data || {} 
                },
                access_token: 'mock-token'
              }
            }, 
            error: null 
          };
        },
        signInWithPassword: async ({ email, password }: any) => {
          console.log('Mock signIn:', { email, password });
          // Simulate successful login
          const mockUser = {
            id: email.includes('owner') || email.includes('admin') ? 'mock-owner-id' : 'mock-user-id',
            email,
            user_metadata: {
              role: email.includes('owner') || email.includes('admin') ? 'owner' : 'user'
            }
          };
          return { 
            data: { 
              user: mockUser, 
              session: { 
                user: mockUser,
                access_token: 'mock-token'
              } 
            }, 
            error: null 
          };
        },
        signOut: async () => {
          console.log('Mock signOut');
          return { error: null };
        },
        getSession: async () => {
          return { data: { session: null }, error: null };
        },
        onAuthStateChange: (callback: any) => {
          console.log('Mock onAuthStateChange');
          // Call the callback immediately with no session for initial state
          setTimeout(() => callback('SIGNED_OUT', null), 0);
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        getUser: async () => {
          return { data: { user: null }, error: null };
        }
      },
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            single: async () => ({ data: null, error: null }),
            then: async (callback: any) => callback({ data: [], error: null })
          }),
          then: async (callback: any) => callback({ data: [], error: null })
        }),
        insert: (data: any) => ({ 
          select: () => ({
            single: async () => ({ data: null, error: null })
          }),
          then: async (callback: any) => callback({ data: null, error: null })
        }),
        update: (data: any) => ({ 
          eq: (column: string, value: any) => ({ 
            then: async (callback: any) => callback({ data: null, error: null })
          })
        }),
        delete: () => ({
          eq: (column: string, value: any) => ({
            then: async (callback: any) => callback({ data: null, error: null })
          })
        })
      }),
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string, file: File) => ({ data: { path }, error: null }),
          getPublicUrl: (path: string) => ({ data: { publicUrl: `mock-url/${path}` } })
        })
      }
    } as any;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

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
