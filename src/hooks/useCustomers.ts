import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Customer, Comment, mockCustomers } from '@/lib/mockData';
import { useState } from 'react';

// In-memory storage for demo purposes
const customersData = [...mockCustomers];

export const useCustomers = () => {
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: () => Promise.resolve(customersData),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addCustomerMutation = useMutation({
    mutationFn: (newCustomer: Omit<Customer, 'id' | 'updatedAt' | 'comments'>) => {
      const customer: Customer = {
        ...newCustomer,
        id: Date.now().toString(),
        updatedAt: new Date().toISOString(),
        comments: [],
      };
      customersData.push(customer);
      return Promise.resolve(customer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, ...updates }: Partial<Customer> & { id: string }) => {
      const index = customersData.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Customer not found');
      
      customersData[index] = {
        ...customersData[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return Promise.resolve(customersData[index]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (id: string) => {
      const index = customersData.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Customer not found');
      
      customersData.splice(index, 1);
      return Promise.resolve(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ customerId, text, userId, userName }: { 
      customerId: string; 
      text: string; 
      userId: string; 
      userName: string; 
    }) => {
      const customerIndex = customersData.findIndex(c => c.id === customerId);
      if (customerIndex === -1) throw new Error('Customer not found');
      
      const newComment: Comment = {
        id: Date.now().toString(),
        text,
        userId,
        userName,
        timestamp: new Date().toISOString(),
      };
      
      customersData[customerIndex].comments.unshift(newComment); // Add to beginning for newest first
      customersData[customerIndex].updatedAt = new Date().toISOString();
      
      return Promise.resolve(customersData[customerIndex]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  return {
    customers: customersData,
    isLoading: customersQuery.isLoading,
    error: customersQuery.error,
    addCustomer: addCustomerMutation.mutate,
    updateCustomer: updateCustomerMutation.mutate,
    deleteCustomer: deleteCustomerMutation.mutate,
    addComment: addCommentMutation.mutate,
    isAdding: addCustomerMutation.isPending,
    isUpdating: updateCustomerMutation.isPending,
    isDeleting: deleteCustomerMutation.isPending,
    isAddingComment: addCommentMutation.isPending,
  };
};

export const useCustomer = (id: string) => {
  const { customers } = useCustomers();
  return customers.find(customer => customer.id === id);
};

export const useCustomerSearch = () => {
  const { customers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [packageTypeFilter, setPackageTypeFilter] = useState<string>('all');
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesDestination = destinationFilter === 'all' || customer.destination === destinationFilter;
    const matchesPackageType = packageTypeFilter === 'all' || customer.packageType === packageTypeFilter;
    const matchesLeadType = leadTypeFilter === 'all' || customer.leadType === leadTypeFilter;

    return matchesSearch && matchesStatus && matchesDestination && matchesPackageType && matchesLeadType;
  });

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
  };
};