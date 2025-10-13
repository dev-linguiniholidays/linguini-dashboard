'use client';

import { useState } from 'react';
import { Customer } from '@/lib/types';
import { CustomerTable } from '@/components/CustomerTable';
import { CustomerForm } from '@/components/CustomerForm';
import { CustomerDetails } from '@/components/CustomerDetails';
import { useCustomers, useCustomerSearch } from '@/hooks/useCustomers';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomersPage() {
  const { customers: allCustomers, addCustomer, updateCustomer, deleteCustomer, addComment, isLoading, destinationOptions, assigneeOptions } = useCustomers();
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
    serviceFilter,
    setServiceFilter,
    assigneeFilter,
    setAssigneeFilter,
    destinationOptions: searchDestinationOptions,
    assigneeOptions: searchAssigneeOptions,
  } = useCustomerSearch(allCustomers, destinationOptions, assigneeOptions);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
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
    setIsCommentModalOpen(true);
  };

  const handleSave = async (customerData: Omit<Customer, 'id' | 'updatedAt' | 'comments'>) => {
    try {
      await addCustomer(customerData);
      setIsAddModalOpen(false);
    } catch (_error) {
      toast.error('Failed to add customer', {
        style: {
          backgroundColor: '#ef4444',
          color: 'white',
        },
      });
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Customer>) => {
    try {
      await updateCustomer({ id, ...updates });
      setIsEditModalOpen(false);
      setIsDetailsModalOpen(false);
    } catch (_error) {
      toast.error('Failed to update customer', {
        style: {
          backgroundColor: '#ef4444',
          color: 'white',
        },
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
      } catch (_error) {
        toast.error('Failed to delete customer', {
          style: {
            backgroundColor: '#ef4444',
            color: 'white',
          },
        });
      }
    }
  };

  const handleAddComment = async (customerId: string, text: string) => {
    if (!user) return;
    try {
      await addComment({ 
        customerId, 
        text, 
        userId: user.id, 
        userName: typeof window !== 'undefined' ? localStorage.getItem('user-name') || 'User' : 'User'
      });
    } catch (_error) {
      toast.error('Failed to add comment', {
        style: {
          backgroundColor: '#ef4444',
          color: 'white',
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Manage your travel customers and leads</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading customers...</p>
          </div>
        </div>
      ) : (
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
          serviceFilter={serviceFilter}
          onServiceFilterChange={setServiceFilter}
          assigneeFilter={assigneeFilter}
          onAssigneeFilterChange={setAssigneeFilter}
          onViewComments={handleViewComments}
          destinationOptions={searchDestinationOptions}
          assigneeOptions={searchAssigneeOptions}
        />
      )}

      {/* Add Customer Modal */}
      <CustomerForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSave}
        assigneeOptions={searchAssigneeOptions}
      />

      {/* Edit Customer Modal */}
      <CustomerForm
        customer={selectedCustomer || undefined}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        onUpdate={handleUpdate}
        assigneeOptions={searchAssigneeOptions}
      />

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onUpdate={handleUpdate}
          onAddComment={handleAddComment}
          assigneeOptions={searchAssigneeOptions}
        />
      )}

      {/* Customer Comments Modal */}
      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          onUpdate={handleUpdate}
          onAddComment={handleAddComment}
          assigneeOptions={searchAssigneeOptions}
          commentMode={true}
        />
      )}
    </div>
  );
}