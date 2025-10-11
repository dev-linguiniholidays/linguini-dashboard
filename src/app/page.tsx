'use client';

import { useState } from 'react';
import { Customer } from '@/lib/mockData';
import { CustomerTable } from '@/components/CustomerTable';
import { CustomerForm } from '@/components/CustomerForm';
import { CustomerDetails } from '@/components/CustomerDetails';
import { useCustomers, useCustomerSearch } from '@/hooks/useCustomers';
import { getCurrentUser } from '@/lib/roleUtils';
import { Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { addCustomer, updateCustomer, deleteCustomer, addComment } = useCustomers();
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
  } = useCustomerSearch();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Calculate stats
  const totalCustomers = customers.length;
  const hotLeads = customers.filter(c => c.status === 'hot').length;
  const convertedLeads = customers.filter(c => c.status === 'converted').length;
  const ongoingLeads = customers.filter(c => c.status === 'ongoing').length;

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
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
    const currentUser = getCurrentUser();
    addComment({ customerId, text, userId: currentUser.id, userName: currentUser.name });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your travel CRM dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hot Leads</p>
              <p className="text-2xl font-bold text-gray-900">{hotLeads}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-gray-900">{convertedLeads}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ongoing</p>
              <p className="text-2xl font-bold text-gray-900">{ongoingLeads}</p>
            </div>
          </div>
        </div>
      </div>

      {/* All Customers Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Customers</h2>
        </div>
        
        <CustomerTable
          customers={customers}
          onEdit={handleEdit}
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
      </div>

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