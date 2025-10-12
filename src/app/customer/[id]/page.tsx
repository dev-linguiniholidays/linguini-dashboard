'use client';

import { useParams } from 'next/navigation';
import { useCustomer } from '@/hooks/useCustomers';
import { Customer } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CustomerDetails } from '@/components/CustomerDetails';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuth } from '@/contexts/AuthContext';
import { displayValue } from '@/lib/displayUtils';

const statusColors = {
  fresh: 'bg-blue-100 text-blue-800',
  'no-response': 'bg-gray-100 text-gray-800',
  ongoing: 'bg-yellow-100 text-yellow-800',
  converted: 'bg-green-100 text-green-800',
  dead: 'bg-red-100 text-red-800',
  future: 'bg-purple-100 text-purple-800',
  hot: 'bg-orange-100 text-orange-800',
};

const packageTypeColors = {
  private: 'bg-indigo-100 text-indigo-800',
  group: 'bg-pink-100 text-pink-800',
};

const leadTypeColors = {
  calling: 'bg-blue-100 text-blue-800',
  instagram: 'bg-pink-100 text-pink-800',
  referral: 'bg-green-100 text-green-800',
  website: 'bg-purple-100 text-purple-800',
  facebook: 'bg-blue-100 text-blue-800',
  'walk-in': 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  const customer = useCustomer(customerId);
  const { updateCustomer, addComment } = useCustomers();
  const { user } = useAuth();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Not Found</h2>
          <p className="text-gray-600 mb-4">The customer you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/customers">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      fresh: 'Fresh',
      'no-response': 'No Response',
      ongoing: 'Ongoing',
      converted: 'Converted',
      dead: 'Dead',
      future: 'Future',
      hot: 'Hot',
    };
    return labels[status] || status;
  };

  const getPackageTypeLabel = (type: string) => {
    return type === 'private' ? 'Private' : 'Group';
  };

  const getLeadTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      calling: 'Calling',
      instagram: 'Instagram',
      referral: 'Referral',
      website: 'Website',
      facebook: 'Facebook',
      'walk-in': 'Walk-in',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const handleUpdate = (id: string, updates: Partial<Customer>) => {
    updateCustomer({ id, ...updates });
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/customers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600">{displayValue(customer.destination)}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsDetailsModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Phone:</span> {customer.phone}</p>
              <p className="text-sm"><span className="font-medium">Destination:</span> {displayValue(customer.destination)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Travel Details</h3>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Start Date:</span> {formatDate(customer.travelStartDate)}</p>
              <p className="text-sm"><span className="font-medium">End Date:</span> {formatDate(customer.travelEndDate)}</p>
              <p className="text-sm"><span className="font-medium">Passengers:</span> {displayValue(customer.numberOfPax)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Lead Information</h3>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Created:</span> {formatDate(customer.leadCreationDate)}</p>
              <p className="text-sm"><span className="font-medium">Last Updated:</span> {formatDateTime(customer.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <Badge className={`ml-2 ${statusColors[customer.status]}`}>
                {getStatusLabel(customer.status)}
              </Badge>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Package Type:</span>
              <Badge className={`ml-2 ${packageTypeColors[customer.packageType]}`}>
                {getPackageTypeLabel(customer.packageType)}
              </Badge>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Lead Type:</span>
              <Badge className={`ml-2 ${leadTypeColors[customer.leadType]}`}>
                {getLeadTypeLabel(customer.leadType)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
          <p className="text-sm text-gray-700">{displayValue(customer.description, 'No description provided')}</p>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Comments ({customer.comments.length})
          </h3>
        </div>

        {customer.comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No comments yet</p>
        ) : (
          <div className="space-y-3">
            {customer.comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.userName}</span>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(comment.timestamp)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      <CustomerDetails
        customer={customer}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onUpdate={handleUpdate}
        onAddComment={handleAddComment}
      />
    </div>
  );
}