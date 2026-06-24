'use client';

import { useRouter } from 'next/navigation';
import { Booking } from '@/lib/types';
import { BookingTable } from '@/components/BookingTable';
import { useBookings, useBookingSearch } from '@/hooks/useBookings';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BookingsPage() {
  const router = useRouter();
  const { 
    bookings: allBookings, 
    deleteBooking, 
    isLoading, 
    destinationOptions, 
    assigneeOptions 
  } = useBookings();
  const {
    bookings,
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
  } = useBookingSearch(allBookings, destinationOptions, assigneeOptions);

  const handleEdit = (booking: Booking) => {
    router.push(`/booking/${booking.id}?edit=true`);
  };

  const handleView = (booking: Booking) => {
    router.push(`/booking/${booking.id}`);
  };

  const handleViewComments = (booking: Booking) => {
    router.push(`/booking/${booking.id}?tab=comments`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(id);
      } catch {
        toast.error('Failed to delete booking', {
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
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600">Manage your confirmed bookings and transactions</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      ) : (
        <BookingTable
          bookings={bookings}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
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
          destinationOptions={searchDestinationOptions}
          assigneeOptions={searchAssigneeOptions}
        />
      )}

      {/* Modals for edit, details, and comments have been replaced by the dedicated booking details page */}
    </div>
  );
}
