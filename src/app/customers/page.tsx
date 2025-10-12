'use client';

import { useState } from 'react';
import { Customer } from '@/lib/mockData';
import { CustomerTable } from '@/components/CustomerTable';
import { CustomerForm } from '@/components/CustomerForm';
import { CustomerDetails } from '@/components/CustomerDetails';
import { useCustomers, useCustomerSearch } from '@/hooks/useCustomers';
import { useAuth } from '@/contexts/AuthContext';

export default function CustomersPage() {
  const { customers: allCustomers, addCustomer, updateCustomer, deleteCustomer, addComment } = useCustomers();
  const { user } = useAuth();
  const {
    customers,
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
  } = useCustomerSearch(allCustomers);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const handleViewComments = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const handleSave = (customerData: Omit<Customer, 'id' | 'updatedAt' | 'comments'>) => {
    addCustomer(customerData);
    setIsAddModalOpen(false);
  };

  const handleUpdate = (id: string, updates: Partial<Customer>) => {
    updateCustomer({ id, ...updates });
    setIsEditModalOpen(false);
    setIsDetailsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
    }
  };

  const handleAddComment = (customerId: string, text: string) => {
    if (!user) return;
    addComment({ 
      customerId, 
      text, 
      userId: user.id, 
      userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User' 
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Manage your travel customers and leads</p>
      </div>

      <CustomerTable
        customers={customers}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onAdd={handleAdd}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        destinationFilter={destinationFilter}
        onDestinationFilterChange={setDestinationFilter}
        packageTypeFilter={packageTypeFilter}
        onPackageTypeFilterChange={setPackageTypeFilter}
        leadTypeFilter={leadTypeFilter}
        onLeadTypeFilterChange={setLeadTypeFilter}
        onViewComments={handleViewComments}
      />

      {/* Add Customer Modal */}
      <CustomerForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSave}
      />

      {/* Edit Customer Modal */}
      <CustomerForm
        customer={selectedCustomer || undefined}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        onUpdate={handleUpdate}
      />

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onUpdate={handleUpdate}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}