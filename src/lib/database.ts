import { supabase } from './supabase';
import { Database } from './supabase';
import { Customer as FrontendCustomer, Booking as FrontendBooking, Expense as FrontendExpense } from './types';

type Customer = Database['public']['Tables']['customers']['Row'];
type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];
type Comment = Database['public']['Tables']['customer_comments']['Row'];
type CommentInsert = Database['public']['Tables']['customer_comments']['Insert'];

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];
type BookingComment = Database['public']['Tables']['booking_comments']['Row'];
type BookingCommentInsert = Database['public']['Tables']['booking_comments']['Insert'];
type BookingExpense = Database['public']['Tables']['booking_expenses']['Row'];
type BookingExpenseInsert = Database['public']['Tables']['booking_expenses']['Insert'];


// Customer operations
export const customerService = {
  // Get all customers
  async getAll(): Promise<Customer[]> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get customer by ID
  async getById(id: string): Promise<Customer | null> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }
    return data;
  },

  // Create new customer
  async create(customer: CustomerInsert): Promise<Customer> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update customer
  async update(id: string, updates: CustomerUpdate): Promise<Customer> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete customer
  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Search customers
  async search(filters: {
    searchTerm?: string;
    status?: string;
    destination?: string;
    leadType?: string;
    service?: string;
    assignee?: string;
  }): Promise<Customer[]> {
    if (!supabase) throw new Error('Supabase not configured');
    
    let query = supabase.from('customers').select('*');
    
    if (filters.searchTerm) {
      query = query.or(`name.ilike.%${filters.searchTerm}%,phone.ilike.%${filters.searchTerm}%,destination.ilike.%${filters.searchTerm}%`);
    }
    
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    if (filters.destination && filters.destination !== 'all') {
      query = query.eq('destination', filters.destination);
    }
    
    
    if (filters.leadType && filters.leadType !== 'all') {
      query = query.eq('lead_type', filters.leadType);
    }
    
    if (filters.service && filters.service !== 'all') {
      query = query.eq('service', filters.service);
    }
    
    if (filters.assignee && filters.assignee !== 'all') {
      query = query.eq('assignee', filters.assignee);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get user information by email
  async getUserByEmail(email: string): Promise<{ name: string; role: string } | null> {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('name, role')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      name: data.name,
      role: data.role
    };
  },

  // Get unique destinations from customers table
  async getUniqueDestinations(): Promise<string[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('customers')
      .select('destination')
      .not('destination', 'is', null);

    if (error || !data) {
      return [];
    }

    // Extract unique destinations and filter out null values
    const uniqueDestinations = [...new Set(data.map(item => item.destination).filter(Boolean))];
    return uniqueDestinations.sort();
  },

  // Get unique travel advisor names from users table
  async getUniqueAssignees(): Promise<string[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('users')
      .select('name')
      .not('name', 'is', null);

    if (error) {
      console.error('Error fetching travel advisors:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Extract unique names and add 'none' option
    const uniqueNames = [...new Set(data.map(item => item.name).filter(Boolean))];
    const result = ['none', ...uniqueNames.sort()];
    return result;
  },

  // Move customer to bookings
  async moveToBooking(customerId: string): Promise<Booking> {
    if (!supabase) throw new Error('Supabase not configured');

    // 1. Fetch customer details
    const customer = await this.getById(customerId);
    if (!customer) throw new Error('Customer not found');

    // 2. Fetch customer comments
    const { data: comments, error: commentsFetchError } = await supabase
      .from('customer_comments')
      .select('*')
      .eq('customer_id', customerId);

    if (commentsFetchError) throw commentsFetchError;

    // Fetch all existing bookings to calculate the next incremental number for the current financial year
    const { data: bookingsData, error: bookingsFetchError } = await supabase
      .from('bookings')
      .select('booking_id');

    if (bookingsFetchError) throw bookingsFetchError;

    // Financial year calculation (April 1 to March 31)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    let startYear = year;
    let endYear = year + 1;
    if (month < 3) { // Jan, Feb, Mar are in the previous financial year
      startYear = year - 1;
      endYear = year;
    }
    const xx = String(startYear).slice(-2);
    const yy = String(endYear).slice(-2);
    const fyStr = `${xx}/${yy}`;
    const fyPrefix = `LH${fyStr}-`;

    let maxNumber = 130;
    if (bookingsData && bookingsData.length > 0) {
      for (const b of bookingsData) {
        if (b.booking_id && b.booking_id.startsWith(fyPrefix)) {
          const match = b.booking_id.match(/-(\d{4})$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNumber) {
              maxNumber = num;
            }
          }
        }
      }
    }
    const nextNumber = maxNumber + 1;
    const formattedNumber = String(nextNumber).padStart(4, '0');
    const generatedBookingId = `${fyPrefix}${formattedNumber}`;

    // 3. Create booking entry (preserve ID)
    const bookingInsert: BookingInsert = {
      id: customer.id,
      booking_id: generatedBookingId,
      name: customer.name,
      phone: customer.phone,
      destination: customer.destination,
      status: 'upcoming', // Default status for confirmed bookings is upcoming
      description: customer.description,
      travel_start_date: customer.travel_start_date,
      travel_end_date: customer.travel_end_date,
      lead_creation_date: customer.lead_creation_date,
      number_of_pax: customer.number_of_pax,
      lead_type: customer.lead_type,
      service: customer.service,
      assignee: customer.assignee,
      package_cost: 0,
    };

    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingInsert)
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 4. Copy comments to booking_comments
    if (comments && comments.length > 0) {
      const bookingCommentsInsert = comments.map(comment => ({
        booking_id: bookingData.id,
        text: comment.text,
        user_id: comment.user_id,
        user_name: comment.user_name,
        created_at: comment.created_at
      }));

      const { error: commentsError } = await supabase
        .from('booking_comments')
        .insert(bookingCommentsInsert);

      if (commentsError) {
        console.error('Error copying comments to booking_comments:', commentsError);
      }
    }

    // 5. Delete customer (cascades comment delete)
    const { error: deleteError } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId);

    if (deleteError) {
      throw deleteError;
    }

    return bookingData;
  }
};

// Comment operations
export const commentService = {
  // Get comments for a customer
  async getByCustomerId(customerId: string): Promise<Comment[]> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('customer_comments')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Add comment
  async add(comment: CommentInsert): Promise<Comment> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('customer_comments')
      .insert(comment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete comment
  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('customer_comments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Helper function to convert database customer to frontend customer format
export const convertDbCustomerToFrontend = (dbCustomer: Customer) => ({
  id: dbCustomer.id,
  name: dbCustomer.name,
  phone: dbCustomer.phone,
  destination: dbCustomer.destination || '',
  status: dbCustomer.status,
  description: dbCustomer.description || '',
  travelStartDate: dbCustomer.travel_start_date || '',
  travelEndDate: dbCustomer.travel_end_date || '',
  leadCreationDate: dbCustomer.lead_creation_date,
  numberOfPax: dbCustomer.number_of_pax,
  leadType: dbCustomer.lead_type,
  service: dbCustomer.service,
  assignee: dbCustomer.assignee,
  comments: [], // Will be loaded separately
  updatedAt: dbCustomer.updated_at,
  isLocked: dbCustomer.is_locked,
});

// Helper function to convert frontend customer to database format
export const convertFrontendCustomerToDb = (frontendCustomer: Omit<FrontendCustomer, 'id' | 'updatedAt' | 'comments' | 'isLocked'>): CustomerInsert => ({
  name: frontendCustomer.name,
  phone: frontendCustomer.phone,
  destination: frontendCustomer.destination || null,
  status: frontendCustomer.status,
  description: frontendCustomer.description || null,
  travel_start_date: frontendCustomer.travelStartDate || null,
  travel_end_date: frontendCustomer.travelEndDate || null,
  lead_creation_date: frontendCustomer.leadCreationDate,
  number_of_pax: frontendCustomer.numberOfPax,
  lead_type: frontendCustomer.leadType,
  service: frontendCustomer.service,
  assignee: frontendCustomer.assignee,
  is_locked: false,
});

// Helper function to convert partial frontend customer updates to database format
export const convertPartialFrontendCustomerToDb = (updates: Partial<FrontendCustomer>): CustomerUpdate => {
  const dbUpdates: CustomerUpdate = {};
  
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.destination !== undefined) dbUpdates.destination = updates.destination || null;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.description !== undefined) dbUpdates.description = updates.description || null;
  if (updates.travelStartDate !== undefined) dbUpdates.travel_start_date = updates.travelStartDate || undefined;
  if (updates.travelEndDate !== undefined) dbUpdates.travel_end_date = updates.travelEndDate || undefined;
  if (updates.leadCreationDate !== undefined) dbUpdates.lead_creation_date = updates.leadCreationDate || undefined;
  if (updates.numberOfPax !== undefined) dbUpdates.number_of_pax = updates.numberOfPax || undefined;
  if (updates.leadType !== undefined) dbUpdates.lead_type = updates.leadType;
  if (updates.service !== undefined) dbUpdates.service = updates.service;
  if (updates.assignee !== undefined) dbUpdates.assignee = updates.assignee;
  if (updates.isLocked !== undefined) dbUpdates.is_locked = updates.isLocked;
  
  return dbUpdates;
};

// Booking operations
export const bookingService = {
  // Get all bookings
  async getAll(): Promise<Booking[]> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get booking by ID
  async getById(id: string): Promise<Booking | null> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }
    return data;
  },

  // Create new booking
  async create(booking: BookingInsert): Promise<Booking> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update booking
  async update(id: string, updates: BookingUpdate): Promise<Booking> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete booking
  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Search bookings
  async search(filters: {
    searchTerm?: string;
    status?: string;
    destination?: string;
    leadType?: string;
    service?: string;
    assignee?: string;
  }): Promise<Booking[]> {
    if (!supabase) throw new Error('Supabase not configured');
    
    let query = supabase.from('bookings').select('*');
    
    if (filters.searchTerm) {
      query = query.or(`name.ilike.%${filters.searchTerm}%,phone.ilike.%${filters.searchTerm}%,destination.ilike.%${filters.searchTerm}%`);
    }
    
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    if (filters.destination && filters.destination !== 'all') {
      query = query.eq('destination', filters.destination);
    }
    
    
    if (filters.leadType && filters.leadType !== 'all') {
      query = query.eq('lead_type', filters.leadType);
    }
    
    if (filters.service && filters.service !== 'all') {
      query = query.eq('service', filters.service);
    }
    
    if (filters.assignee && filters.assignee !== 'all') {
      query = query.eq('assignee', filters.assignee);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get unique destinations from bookings table
  async getUniqueDestinations(): Promise<string[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('destination')
      .not('destination', 'is', null);

    if (error || !data) {
      return [];
    }

    const uniqueDestinations = [...new Set(data.map(item => item.destination).filter(Boolean))];
    return uniqueDestinations.sort();
  }
};

// Booking Comment operations
export const bookingCommentService = {
  // Get comments for a booking
  async getByBookingId(bookingId: string): Promise<BookingComment[]> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('booking_comments')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Add comment
  async add(comment: BookingCommentInsert): Promise<BookingComment> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('booking_comments')
      .insert(comment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete comment
  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('booking_comments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Helper function to convert database booking to frontend format
export const convertDbBookingToFrontend = (dbBooking: Booking) => ({
  id: dbBooking.id,
  bookingId: dbBooking.booking_id || '',
  name: dbBooking.name,
  phone: dbBooking.phone,
  destination: dbBooking.destination || '',
  status: dbBooking.status,
  description: dbBooking.description || '',
  travelStartDate: dbBooking.travel_start_date || '',
  travelEndDate: dbBooking.travel_end_date || '',
  leadCreationDate: dbBooking.lead_creation_date,
  numberOfPax: dbBooking.number_of_pax,
  leadType: dbBooking.lead_type,
  service: dbBooking.service,
  assignee: dbBooking.assignee,
  comments: [], // Will be loaded separately
  updatedAt: dbBooking.updated_at,
  packageCost: dbBooking.package_cost,
  expenses: [], // Will be loaded separately
});

// Helper function to convert frontend booking to database format
export const convertFrontendBookingToDb = (frontendBooking: Omit<FrontendBooking, 'id' | 'updatedAt' | 'comments' | 'expenses'>): BookingInsert => ({
  name: frontendBooking.name,
  phone: frontendBooking.phone,
  destination: frontendBooking.destination || null,
  status: frontendBooking.status,
  description: frontendBooking.description || null,
  travel_start_date: frontendBooking.travelStartDate || null,
  travel_end_date: frontendBooking.travelEndDate || null,
  lead_creation_date: frontendBooking.leadCreationDate,
  number_of_pax: frontendBooking.numberOfPax,
  lead_type: frontendBooking.leadType,
  service: frontendBooking.service,
  assignee: frontendBooking.assignee,
  package_cost: frontendBooking.packageCost || 0,
  booking_id: frontendBooking.bookingId || null,
});

// Helper function to convert partial frontend booking updates to database format
export const convertPartialFrontendBookingToDb = (updates: Partial<FrontendBooking>): BookingUpdate => {
  const dbUpdates: BookingUpdate = {};
  
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.destination !== undefined) dbUpdates.destination = updates.destination || null;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.description !== undefined) dbUpdates.description = updates.description || null;
  if (updates.travelStartDate !== undefined) dbUpdates.travel_start_date = updates.travelStartDate || undefined;
  if (updates.travelEndDate !== undefined) dbUpdates.travel_end_date = updates.travelEndDate || undefined;
  if (updates.leadCreationDate !== undefined) dbUpdates.lead_creation_date = updates.leadCreationDate || undefined;
  if (updates.numberOfPax !== undefined) dbUpdates.number_of_pax = updates.numberOfPax || undefined;
  if (updates.leadType !== undefined) dbUpdates.lead_type = updates.leadType;
  if (updates.service !== undefined) dbUpdates.service = updates.service;
  if (updates.assignee !== undefined) dbUpdates.assignee = updates.assignee;
  if (updates.packageCost !== undefined) dbUpdates.package_cost = updates.packageCost;
  if (updates.bookingId !== undefined) dbUpdates.booking_id = updates.bookingId || null;
  
  return dbUpdates;
};

// Booking Expense operations
export const bookingExpenseService = {
  // Get expenses for a booking
  async getByBookingId(bookingId: string): Promise<FrontendExpense[]> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('booking_expenses')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return (data || []).map(convertDbExpenseToFrontend);
  },

  // Add expense
  async add(expense: BookingExpenseInsert): Promise<FrontendExpense> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('booking_expenses')
      .insert(expense)
      .select()
      .single();
    
    if (error) throw error;
    return convertDbExpenseToFrontend(data);
  },

  // Delete expense
  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('booking_expenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const convertDbExpenseToFrontend = (dbExpense: BookingExpense): FrontendExpense => ({
  id: dbExpense.id,
  amount: dbExpense.amount,
  category: dbExpense.category,
  description: dbExpense.description || '',
  userId: dbExpense.user_id,
  userName: dbExpense.user_name,
  timestamp: dbExpense.created_at,
});

