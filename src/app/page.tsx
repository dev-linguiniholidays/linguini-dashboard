'use client';

import { useState } from 'react';
import { useCustomers, useCustomerSearch } from '@/hooks/useCustomers';
import { CustomerTable } from '@/components/CustomerTable';
import { CustomerForm } from '@/components/CustomerForm';
import { CustomerDetails } from '@/components/CustomerDetails';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const {
    customers,
    isLoading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addComment,
    isAdding,
    isUpdating,
    isDeleting,
    isAddingComment,
  } = useCustomers();

  const {
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
  } = useCustomerSearch();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const handleAddCustomer = (customerData: any) => {
    addCustomer(customerData, {
      onSuccess: () => {
        toast.success('Customer added successfully!');
        setIsAddModalOpen(false);
      },
      onError: (error: any) => {
        toast.error('Failed to add customer: ' + error.message);
      },
    });
  };

  const handleUpdateCustomer = (id: string, updates: any) => {
    updateCustomer({ id, ...updates }, {
      onSuccess: () => {
        toast.success('Customer updated successfully!');
        setIsEditModalOpen(false);
        setIsDetailsModalOpen(false);
      },
      onError: (error: any) => {
        toast.error('Failed to update customer: ' + error.message);
      },
    });
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id, {
        onSuccess: () => {
          toast.success('Customer deleted successfully!');
        },
        onError: (error: any) => {
          toast.error('Failed to delete customer: ' + error.message);
        },
      });
    }
  };

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleCommentCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const handleAddComment = (customerId: string, text: string, userId: string, userName: string) => {
    addComment({ customerId, text, userId, userName }, {
      onSuccess: () => {
        toast.success('Comment added successfully!');
      },
      onError: (error: any) => {
        toast.error('Failed to add comment: ' + error.message);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
            <p className="text-gray-600">Manage your travel customers</p>
          </div>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">
            {customers.length}
          </div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-orange-600">
            {customers.filter(c => c.status === 'hot').length}
          </div>
          <div className="text-sm text-gray-600">Hot</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">
            {customers.filter(c => c.status === 'ongoing').length}
          </div>
          <div className="text-sm text-gray-600">Ongoing</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {customers.filter(c => c.status === 'converted').length}
          </div>
          <div className="text-sm text-gray-600">Converted</div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <CustomerTable
            customers={filteredCustomers}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            onView={handleViewCustomer}
            onComment={handleCommentCustomer}
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
          />
        </div>
      </div>

      {/* Modals */}
      <CustomerForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCustomer}
        isLoading={isAdding}
      />

      <CustomerForm
        customer={selectedCustomer || undefined}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        onUpdate={handleUpdateCustomer}
        isLoading={isUpdating}
      />

      <CustomerDetails
        customer={selectedCustomer}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCustomer(null);
        }}
        onUpdate={handleUpdateCustomer}
        onAddComment={handleAddComment}
        isLoading={isUpdating || isAddingComment}
      />
    </div>
  );
}