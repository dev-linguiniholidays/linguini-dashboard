'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Customer } from '@/lib/types';
import { CustomerTable } from '@/components/CustomerTable';
import { CustomerForm } from '@/components/CustomerForm';
import { useCustomers, useCustomerSearch } from '@/hooks/useCustomers';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomersPage() {
  const router = useRouter();
  const { customers: allCustomers, addCustomer, deleteCustomer, lockCustomer, confirmBooking, isLoading, destinationOptions, assigneeOptions } = useCustomers();
  const {
    customers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    destinationFilter,
    setDestinationFilter,
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

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    router.push(`/customer/${customer.id}?edit=true`);
  };

  const handleView = (customer: Customer) => {
    router.push(`/customer/${customer.id}`);
  };

  const handleViewComments = (customer: Customer) => {
    router.push(`/customer/${customer.id}?tab=comments`);
  };

  const handleSave = async (customerData: Omit<Customer, 'id' | 'updatedAt' | 'comments' | 'isLocked'>) => {
    try {
      await addCustomer(customerData);
      setIsAddModalOpen(false);
    } catch {
      toast.error('Failed to add customer lead', {
        style: {
          backgroundColor: '#ef4444',
          color: 'white',
        },
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer lead?')) {
      try {
        await deleteCustomer(id);
      } catch {
        toast.error('Failed to delete customer lead', {
          style: {
            backgroundColor: '#ef4444',
            color: 'white',
          },
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Leads</h1>
        <p className="text-gray-600">Manage your travel customer leads and requests</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading customer leads...</p>
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
          leadTypeFilter={leadTypeFilter}
          onLeadTypeFilterChange={setLeadTypeFilter}
          serviceFilter={serviceFilter}
          onServiceFilterChange={setServiceFilter}
          assigneeFilter={assigneeFilter}
          onAssigneeFilterChange={setAssigneeFilter}
          onViewComments={handleViewComments}
          onLock={lockCustomer}
          onConfirmBooking={confirmBooking}
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

      {/* Modals for edit, details, and comments have been replaced by the dedicated customer details page */}
    </div>
  );
}