import { supabase } from './supabase';
import { Database } from './supabase';

type Customer = Database['public']['Tables']['customers']['Row'];
type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];
type Comment = Database['public']['Tables']['customer_comments']['Row'];
type CommentInsert = Database['public']['Tables']['customer_comments']['Insert'];

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
    packageType?: string;
    leadType?: string;
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
    
    if (filters.packageType && filters.packageType !== 'all') {
      query = query.eq('package_type', filters.packageType);
    }
    
    if (filters.leadType && filters.leadType !== 'all') {
      query = query.eq('lead_type', filters.leadType);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
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
  packageType: dbCustomer.package_type,
  leadType: dbCustomer.lead_type,
  comments: [], // Will be loaded separately
  updatedAt: dbCustomer.updated_at,
});

// Helper function to convert frontend customer to database format
export const convertFrontendCustomerToDb = (frontendCustomer: any): CustomerInsert => ({
  name: frontendCustomer.name,
  phone: frontendCustomer.phone,
  destination: frontendCustomer.destination || null,
  status: frontendCustomer.status,
  description: frontendCustomer.description || null,
  travel_start_date: frontendCustomer.travelStartDate || null,
  travel_end_date: frontendCustomer.travelEndDate || null,
  lead_creation_date: frontendCustomer.leadCreationDate,
  number_of_pax: frontendCustomer.numberOfPax,
  package_type: frontendCustomer.packageType,
  lead_type: frontendCustomer.leadType,
});
