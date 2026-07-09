'use client';

import { useCustomers } from '@/hooks/useCustomers';
import { useBookings } from '@/hooks/useBookings';
import { Users, TrendingUp, Clock, CheckCircle, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { customers: allCustomers, isLoading } = useCustomers();
  const { bookings: allBookings } = useBookings();

  // Calculate stats
  const totalLeads = allCustomers.length;
  const hotLeads = allCustomers.filter(c => c.status === 'hot').length;
  const totalBookings = allBookings.length;
  const ongoingLeads = allCustomers.filter(c => c.status === 'ongoing').length;

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
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-400">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
              )}
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
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-400">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{hotLeads}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-400">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ongoing Leads</p>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-400">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{ongoingLeads}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}