import { useState, useEffect } from 'react';
import { Customer, Comment } from '@/lib/types';
import { customerService, commentService, convertDbCustomerToFrontend, convertFrontendCustomerToDb, convertPartialFrontendCustomerToDb } from '@/lib/database';
import { supabase } from '@/lib/supabase';
import { canEditCustomer } from '@/lib/roleUtils';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [destinationOptions, setDestinationOptions] = useState<string[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadCustomers = async () => {
      setIsLoading(true);
      try {
        if (supabase) {
          // Use Supabase database
          const dbCustomers = await customerService.getAll();
          const frontendCustomers = dbCustomers.map(convertDbCustomerToFrontend);
          
          // Load comments for each customer
          const customersWithComments = await Promise.all(
            frontendCustomers.map(async (customer) => {
              const comments = await commentService.getByCustomerId(customer.id);
              return {
                ...customer,
                comments: comments.map(comment => ({
                  id: comment.id,
                  text: comment.text,
                  userId: comment.user_id,
                  userName: comment.user_name,
                  timestamp: comment.created_at,
                }))
              };
            })
          );
          
          setCustomers(customersWithComments);

          // Load dynamic filter options
          try {
            const [destinations, assignees] = await Promise.all([
              customerService.getUniqueDestinations(),
              customerService.getUniqueAssignees()
            ]);
            setDestinationOptions(destinations);
            setAssigneeOptions(assignees);
          } catch (filterError) {
            console.error('Error loading filter options:', filterError);
            // Set empty options - will show loader
            setDestinationOptions([]);
            setAssigneeOptions([]);
          }
        } else {
          // No Supabase connection - show empty state
          setCustomers([]);
          setDestinationOptions([]);
          setAssigneeOptions([]);
        }
      } catch (error) {
        console.error('Error loading customers:', error);
        // Show empty state on error
        setCustomers([]);
        setDestinationOptions([]);
        setAssigneeOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const addCustomer = async (newCustomer: Omit<Customer, 'id' | 'updatedAt' | 'comments'>) => {
    try {
      if (supabase) {
        // Use Supabase database
        const dbCustomer = convertFrontendCustomerToDb(newCustomer);
        const createdCustomer = await customerService.create(dbCustomer);
        const frontendCustomer = convertDbCustomerToFrontend(createdCustomer);
        setCustomers(prev => [frontendCustomer, ...prev]);
      } else {
        // Use database data
        const customer: Customer = {
          ...newCustomer,
          id: Date.now().toString(),
          updatedAt: new Date().toISOString(),
          comments: [],
        };
        setCustomers(prev => [...prev, customer]);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  };

  const updateCustomer = async ({ id, ...updates }: Partial<Customer> & { id: string }) => {
    try {
      if (supabase) {
        // Use Supabase database
        const dbUpdates = convertPartialFrontendCustomerToDb(updates);
        const updatedCustomer = await customerService.update(id, dbUpdates);
        const frontendCustomer = convertDbCustomerToFrontend(updatedCustomer);
        setCustomers(prev => prev.map(c => c.id === id ? frontendCustomer : c));
      } else {
        // Use database data
        setCustomers(prev => prev.map(c => 
          c.id === id 
            ? { ...c, ...updates, updatedAt: new Date().toISOString() }
            : c
        ));
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      if (supabase) {
        // Use Supabase database
        await customerService.delete(id);
        setCustomers(prev => prev.filter(c => c.id !== id));
      } else {
        // Use database data
        setCustomers(prev => prev.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  };

  const addComment = async ({ customerId, text, userId, userName }: { 
    customerId: string; 
    text: string; 
    userId: string; 
    userName: string; 
  }) => {
    // Check if user has edit permission for this customer
    const customer = customers.find(c => c.id === customerId);
    if (!customer || !canEditCustomer(customer)) {
      throw new Error('You do not have permission to add comments to this record');
    }
    
    try {
      if (supabase) {
        // Use Supabase database
        const comment = await commentService.add({
          customer_id: customerId,
          text,
          user_id: userId,
          user_name: userName,
        });
        
        const newComment: Comment = {
          id: comment.id,
          text: comment.text,
          userId: comment.user_id,
          userName: comment.user_name,
          timestamp: comment.created_at,
        };
        
        setCustomers(prev => prev.map(customer => 
          customer.id === customerId 
            ? { ...customer, comments: [newComment, ...customer.comments] }
            : customer
        ));
      } else {
        // Use database data
        const newComment: Comment = {
          id: Date.now().toString(),
          text,
          userId,
          userName,
          timestamp: new Date().toISOString(),
        };
        
        setCustomers(prev => prev.map(c => 
          c.id === customerId 
            ? { 
                ...c, 
                comments: [newComment, ...c.comments],
                updatedAt: new Date().toISOString()
              }
            : c
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  return {
    customers,
    isLoading,
    error: null,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addComment,
    isAdding: false,
    isUpdating: false,
    isDeleting: false,
    isAddingComment: false,
    destinationOptions,
    assigneeOptions,
  };
};

export const useCustomer = (id: string) => {
  const { customers } = useCustomers();
  return customers.find(customer => customer.id === id);
};

export const useCustomerSearch = (customers: Customer[], destinationOptions: string[] = [], assigneeOptions: string[] = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [packageTypeFilter, setPackageTypeFilter] = useState<string>('all');
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      // If no filters are applied, use the main customers list (which includes comments)
      const hasFilters = searchTerm !== '' || 
        statusFilter !== 'all' || 
        destinationFilter !== 'all' || 
        packageTypeFilter !== 'all' || 
        leadTypeFilter !== 'all' ||
        serviceFilter !== 'all' ||
        assigneeFilter !== 'all';

      if (!hasFilters) {
        setFilteredCustomers(customers);
        return;
      }

      if (supabase) {
        // Use Supabase search only when filters are applied
        setIsSearching(true);
        try {
          const results = await customerService.search({
            searchTerm: searchTerm || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            destination: destinationFilter !== 'all' ? destinationFilter : undefined,
            packageType: packageTypeFilter !== 'all' ? packageTypeFilter : undefined,
            leadType: leadTypeFilter !== 'all' ? leadTypeFilter : undefined,
            service: serviceFilter !== 'all' ? serviceFilter : undefined,
            assignee: assigneeFilter !== 'all' ? assigneeFilter : undefined,
          });
          
          const frontendResults = results.map(convertDbCustomerToFrontend);
          
          // Load comments for each search result
          const resultsWithComments = await Promise.all(
            frontendResults.map(async (customer) => {
              const comments = await commentService.getByCustomerId(customer.id);
              return {
                ...customer,
                comments: comments.map(comment => ({
                  id: comment.id,
                  text: comment.text,
                  userId: comment.user_id,
                  userName: comment.user_name,
                  timestamp: comment.created_at,
                }))
              };
            })
          );
          
          setFilteredCustomers(resultsWithComments);
        } catch (error) {
          console.error('Search error:', error);
          setFilteredCustomers(customers);
        } finally {
          setIsSearching(false);
        }
      } else {
        // Use local filtering
        const filtered = customers.filter(customer => {
          const matchesSearch = searchTerm === '' ||
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm) ||
            customer.destination.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
          const matchesDestination = destinationFilter === 'all' || customer.destination === destinationFilter;
          const matchesPackageType = packageTypeFilter === 'all' || customer.packageType === packageTypeFilter;
          const matchesLeadType = leadTypeFilter === 'all' || customer.leadType === leadTypeFilter;
          const matchesService = serviceFilter === 'all' || customer.service === serviceFilter;
          const matchesAssignee = assigneeFilter === 'all' || customer.assignee === assigneeFilter;

          return matchesSearch && matchesStatus && matchesDestination && matchesPackageType && matchesLeadType && matchesService && matchesAssignee;
        });
        setFilteredCustomers(filtered);
      }
    };

    performSearch();
  }, [customers, searchTerm, statusFilter, destinationFilter, packageTypeFilter, leadTypeFilter, serviceFilter, assigneeFilter]);

  return {
    customers: filteredCustomers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    destinationFilter,
    setDestinationFilter,
    packageTypeFilter,
    setPackageTypeFilter,
    leadTypeFilter,
    setLeadTypeFilter,
    serviceFilter,
    setServiceFilter,
    assigneeFilter,
    setAssigneeFilter,
    isSearching,
    destinationOptions,
    assigneeOptions,
  };
};