import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl !== 'https://your-project.supabase.co' && supabaseAnonKey !== 'your-anon-key'

export const supabase = hasValidCredentials ? createClient(supabaseUrl, supabaseAnonKey) : null

// Database types
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          destination: string | null
          status: 'fresh' | 'no-response' | 'ongoing' | 'converted' | 'dead' | 'future' | 'hot'
          description: string | null
          travel_start_date: string | null
          travel_end_date: string | null
          lead_creation_date: string
          number_of_pax: number
          lead_type: 'calling' | 'instagram' | 'referral' | 'website' | 'facebook' | 'walk-in' | 'other'
          service: 'tour-package' | 'flight' | 'train' | 'visa' | 'group-departure' | 'bus' | 'cab' | 'hotel'
          assignee: string
          created_at: string
          updated_at: string
          is_locked: boolean
        }
        Insert: {
          id?: string
          name: string
          phone: string
          destination?: string | null
          status?: 'fresh' | 'no-response' | 'ongoing' | 'converted' | 'dead' | 'future' | 'hot'
          description?: string | null
          travel_start_date?: string | null
          travel_end_date?: string | null
          lead_creation_date?: string
          number_of_pax?: number
          lead_type?: 'calling' | 'instagram' | 'referral' | 'website' | 'facebook' | 'walk-in' | 'other'
          service?: 'tour-package' | 'flight' | 'train' | 'visa' | 'group-departure' | 'bus' | 'cab' | 'hotel'
          assignee?: string
          created_at?: string
          updated_at?: string
          is_locked?: boolean
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          destination?: string | null
          status?: 'fresh' | 'no-response' | 'ongoing' | 'converted' | 'dead' | 'future' | 'hot'
          description?: string | null
          travel_start_date?: string | null
          travel_end_date?: string | null
          lead_creation_date?: string
          number_of_pax?: number
          lead_type?: 'calling' | 'instagram' | 'referral' | 'website' | 'facebook' | 'walk-in' | 'other'
          service?: 'tour-package' | 'flight' | 'train' | 'visa' | 'group-departure' | 'bus' | 'cab' | 'hotel'
          assignee?: string
          created_at?: string
          updated_at?: string
          is_locked?: boolean
        }
      }
      bookings: {
        Row: {
          id: string
          name: string
          phone: string
          destination: string | null
          status: 'upcoming' | 'ongoing' | 'postponed' | 'cancelled' | 'completed'
          description: string | null
          travel_start_date: string | null
          travel_end_date: string | null
          lead_creation_date: string
          number_of_pax: number
          lead_type: 'calling' | 'instagram' | 'referral' | 'website' | 'facebook' | 'walk-in' | 'other'
          service: 'tour-package' | 'flight' | 'train' | 'visa' | 'group-departure' | 'bus' | 'cab' | 'hotel'
          assignee: string
          created_at: string
          updated_at: string
          package_cost: number
        }
        Insert: {
          id?: string
          name: string
          phone: string
          destination?: string | null
          status?: 'upcoming' | 'ongoing' | 'postponed' | 'cancelled' | 'completed'
          description?: string | null
          travel_start_date?: string | null
          travel_end_date?: string | null
          lead_creation_date?: string
          number_of_pax?: number
          lead_type?: 'calling' | 'instagram' | 'referral' | 'website' | 'facebook' | 'walk-in' | 'other'
          service?: 'tour-package' | 'flight' | 'train' | 'visa' | 'group-departure' | 'bus' | 'cab' | 'hotel'
          assignee?: string
          created_at?: string
          updated_at?: string
          package_cost?: number
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          destination?: string | null
          status?: 'upcoming' | 'ongoing' | 'postponed' | 'cancelled' | 'completed'
          description?: string | null
          travel_start_date?: string | null
          travel_end_date?: string | null
          lead_creation_date?: string
          number_of_pax?: number
          lead_type?: 'calling' | 'instagram' | 'referral' | 'website' | 'facebook' | 'walk-in' | 'other'
          service?: 'tour-package' | 'flight' | 'train' | 'visa' | 'group-departure' | 'bus' | 'cab' | 'hotel'
          assignee?: string
          created_at?: string
          updated_at?: string
          package_cost?: number
        }
      }
      customer_comments: {
        Row: {
          id: string
          customer_id: string
          text: string
          user_id: string
          user_name: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          text: string
          user_id: string
          user_name: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          text?: string
          user_id?: string
          user_name?: string
          created_at?: string
        }
      }
      booking_comments: {
        Row: {
          id: string
          booking_id: string
          text: string
          user_id: string
          user_name: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          text: string
          user_id: string
          user_name: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          text?: string
          user_id?: string
          user_name?: string
          created_at?: string
        }
      }
      booking_expenses: {
        Row: {
          id: string
          booking_id: string
          amount: number
          category: 'Hotel' | 'Taxi' | 'Bus' | 'Guide' | 'Travel Hamper' | 'Medical Kit' | 'Misc.'
          description: string | null
          user_id: string
          user_name: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          amount: number
          category: 'Hotel' | 'Taxi' | 'Bus' | 'Guide' | 'Travel Hamper' | 'Medical Kit' | 'Misc.'
          description?: string | null
          user_id: string
          user_name: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          amount?: number
          category?: 'Hotel' | 'Taxi' | 'Bus' | 'Guide' | 'Travel Hamper' | 'Medical Kit' | 'Misc.'
          description?: string | null
          user_id?: string
          user_name?: string
          created_at?: string
        }
      }
    }
  }
}

// Mock user for development
const mockUser = {
  id: 'mock-user-id',
  email: 'admin@linguiniholidays.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: {
    full_name: 'Admin User'
  },
  identities: [],
  factors: [],
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  phone: '',
  phone_confirmed_at: undefined,
  confirmed_at: new Date().toISOString(),
  recovery_sent_at: undefined,
  new_email: undefined,
  invited_at: undefined,
  action_link: undefined,
  email_change_sent_at: undefined,
  new_phone: undefined,
  phone_change_sent_at: undefined,
  reauthentication_sent_at: undefined,
  reauthentication_confirm: undefined,
  is_anonymous: false,
}

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  if (!hasValidCredentials) {
    // Mock authentication for development
    if (email === 'admin@linguiniholidays.com' && password === 'admin123') {
      // Store mock user in localStorage
      localStorage.setItem('mock-user', JSON.stringify(mockUser))
      return { data: { user: mockUser }, error: null }
    } else {
      return { data: null, error: { message: 'Invalid credentials' } }
    }
  }

  const { data, error } = await supabase!.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUp = async (email: string, password: string) => {
  if (!hasValidCredentials) {
    // Mock signup for development
    const newUser = { ...mockUser, email, id: `mock-${Date.now()}` }
    localStorage.setItem('mock-user', JSON.stringify(newUser))
    return { data: { user: newUser }, error: null }
  }

  const { data, error } = await supabase!.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  if (!hasValidCredentials) {
    // Mock signout for development
    localStorage.removeItem('mock-user')
    return { error: null }
  }

  const { error } = await supabase!.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  if (!hasValidCredentials) {
    // Mock getCurrentUser for development
    const storedUser = localStorage.getItem('mock-user')
    return storedUser ? JSON.parse(storedUser) : null
  }

  const { data: { user } } = await supabase!.auth.getUser()
  return user
}
