import { useState, useEffect, useRef } from 'react';
import { Customer, Comment, mockCustomers } from '@/lib/mockData';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const customersDataRef = useRef<Customer[]>([...mockCustomers]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setCustomers(customersDataRef.current);
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const addCustomer = (newCustomer: Omit<Customer, 'id' | 'updatedAt' | 'comments'>) => {
    const customer: Customer = {
      ...newCustomer,
      id: Date.now().toString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    customersDataRef.current.push(customer);
    setCustomers([...customersDataRef.current]);
  };

  const updateCustomer = ({ id, ...updates }: Partial<Customer> & { id: string }) => {
    const index = customersDataRef.current.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    
    customersDataRef.current[index] = {
      ...customersDataRef.current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setCustomers([...customersDataRef.current]);
  };

  const deleteCustomer = (id: string) => {
    const index = customersDataRef.current.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    
    customersDataRef.current.splice(index, 1);
    setCustomers([...customersDataRef.current]);
  };

  const addComment = ({ customerId, text, userId, userName }: { 
    customerId: string; 
    text: string; 
    userId: string; 
    userName: string; 
  }) => {
    const customerIndex = customersDataRef.current.findIndex(c => c.id === customerId);
    if (customerIndex === -1) throw new Error('Customer not found');
    
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      userId,
      userName,
      timestamp: new Date().toISOString(),
    };
    
    customersDataRef.current[customerIndex].comments.unshift(newComment);
    customersDataRef.current[customerIndex].updatedAt = new Date().toISOString();
    setCustomers([...customersDataRef.current]);
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