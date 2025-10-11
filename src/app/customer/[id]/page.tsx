'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCustomer } from '@/hooks/useCustomers';
import { CustomerDetails } from '@/components/CustomerDetails';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { RoleGuard } from '@/components/RoleGuard';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;
  const customer = useCustomer(customerId);
  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdateCustomer = (id: string, updates: any) => {
    // TODO: Implement update logic with React Query
    toast.success('Customer updated successfully!');
    setIsEditModalOpen(false);
  };

  const handleAddComment = (customerId: string, text: string, userId: string, userName: string) => {
    // TODO: Implement add comment logic with React Query
    toast.success('Comment added successfully!');
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      // TODO: Implement delete logic with React Query
      toast.success('Customer deleted successfully!');
      router.push('/');
    }
  };

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-4">Customer not found</div>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {customer.name}
            </h1>
            <p className="text-gray-600">Customer Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <RoleGuard allowedRoles={['admin']}>
            <Button
              variant="outline"
              onClick={() => handleDeleteCustomer(customer.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </RoleGuard>
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <div className="mt-1 text-lg font-semibold">{customer.name}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <div className="mt-1 text-lg">{customer.phone}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Destination</label>
                <div className="mt-1 text-lg">{customer.destination}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    customer.status === 'fresh' ? 'bg-blue-100 text-blue-800' :
                    customer.status === 'no-response' ? 'bg-gray-100 text-gray-800' :
                    customer.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                    customer.status === 'converted' ? 'bg-green-100 text-green-800' :
                    customer.status === 'dead' ? 'bg-red-100 text-red-800' :
                    customer.status === 'future' ? 'bg-purple-100 text-purple-800' :
                    customer.status === 'hot' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.status === 'no-response' ? 'No Response' : customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <div className="mt-1 text-lg">
                  {new Date(customer.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-500">Description</label>
            <div className="mt-1 p-4 bg-gray-50 rounded-lg">
              {customer.description}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Travel Dates</label>
              <div className="mt-1 text-lg">
                {new Date(customer.travelStartDate).toLocaleDateString()} - {new Date(customer.travelEndDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Number of Passengers</label>
              <div className="mt-1 text-lg">
                {customer.numberOfPax}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Package Type</label>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  customer.packageType === 'private' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {customer.packageType.charAt(0).toUpperCase() + customer.packageType.slice(1)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Lead Type</label>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  customer.leadType === 'calling' ? 'bg-green-100 text-green-800' :
                  customer.leadType === 'instagram' ? 'bg-pink-100 text-pink-800' :
                  customer.leadType === 'referral' ? 'bg-blue-100 text-blue-800' :
                  customer.leadType === 'website' ? 'bg-gray-100 text-gray-800' :
                  customer.leadType === 'facebook' ? 'bg-blue-100 text-blue-800' :
                  customer.leadType === 'walk-in' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {customer.leadType === 'walk-in' ? 'Walk-in' : customer.leadType.charAt(0).toUpperCase() + customer.leadType.slice(1)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Lead Creation Date</label>
              <div className="mt-1 text-lg">
                {new Date(customer.leadCreationDate).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CustomerDetails
        customer={customer}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          router.push('/');
        }}
        onUpdate={handleUpdateCustomer}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
