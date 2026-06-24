'use client';

import { useState } from 'react';
import { Booking, Expense } from '@/lib/types';
import { BookingTable } from '@/components/BookingTable';
import { BookingDetails } from '@/components/BookingDetails';
import { useBookings, useBookingSearch } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BookingsPage() {
  const { 
    bookings: allBookings, 
    updateBooking, 
    deleteBooking, 
    addComment, 
    addExpense,
    deleteExpense,
    isLoading, 
    destinationOptions, 
    assigneeOptions 
  } = useBookings();
  const { user } = useAuth();
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const activeBooking = selectedBooking ? bookings.find(b => b.id === selectedBooking.id) || selectedBooking : null;

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleViewComments = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsCommentModalOpen(true);
  };

  const handleUpdate = async (id: string, updates: Partial<Booking>) => {
    try {
      await updateBooking({ id, ...updates });
      setIsEditModalOpen(false);
      setIsDetailsModalOpen(false);
    } catch {
      toast.error('Failed to update booking', {
        style: {
          backgroundColor: '#ef4444',
          color: 'white',
        },
      });
    }
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

  const handleAddComment = async (bookingId: string, text: string) => {
    if (!user) return;
    try {
      await addComment({ 
        bookingId, 
        text, 
        userId: user.id, 
        userName: typeof window !== 'undefined' ? localStorage.getItem('user-name') || 'User' : 'User'
      });
    } catch {
      toast.error('Failed to add comment', {
        style: {
          backgroundColor: '#ef4444',
          color: 'white',
        },
      });
    }
  };

  const handleAddExpense = async (bookingId: string, amount: number, category: Expense['category'], description: string) => {
    if (!user) return;
    try {
      await addExpense({
        bookingId,
        amount,
        category,
        description,
        userId: user.id,
        userName: typeof window !== 'undefined' ? localStorage.getItem('user-name') || 'User' : 'User'
      });
    } catch {
      toast.error('Failed to add expense', {
        style: {
          backgroundColor: '#ef4444',
          color: 'white',
        },
      });
    }
  };

  const handleDeleteExpense = async (bookingId: string, expenseId: string) => {
    try {
      await deleteExpense(bookingId, expenseId);
    } catch {
      toast.error('Failed to delete expense', {
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

      {/* Edit Booking Modal */}
      {activeBooking && isEditModalOpen && (
        <BookingDetails
          booking={activeBooking}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
          onAddComment={handleAddComment}
          onAddExpense={handleAddExpense}
          onDeleteExpense={handleDeleteExpense}
          assigneeOptions={searchAssigneeOptions}
        />
      )}

      {/* Booking Details Modal */}
      {activeBooking && isDetailsModalOpen && (
        <BookingDetails
          booking={activeBooking}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onUpdate={handleUpdate}
          onAddComment={handleAddComment}
          onAddExpense={handleAddExpense}
          onDeleteExpense={handleDeleteExpense}
          assigneeOptions={searchAssigneeOptions}
        />
      )}

      {/* Booking Comments Modal */}
      {activeBooking && isCommentModalOpen && (
        <BookingDetails
          booking={activeBooking}
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          onUpdate={handleUpdate}
          onAddComment={handleAddComment}
          onAddExpense={handleAddExpense}
          onDeleteExpense={handleDeleteExpense}
          assigneeOptions={searchAssigneeOptions}
          commentMode={true}
        />
      )}
    </div>
  );
}
