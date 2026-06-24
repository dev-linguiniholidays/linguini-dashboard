'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Booking } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Trash2, MessageSquare, Eye } from 'lucide-react';
import { RoleGuard } from './RoleGuard';
import { displayValue } from '@/lib/displayUtils';
import { canEditBooking } from '@/lib/roleUtils';
import { toast } from 'sonner';

interface BookingTableProps {
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
  onView: (booking: Booking) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  destinationFilter: string;
  onDestinationFilterChange: (destination: string) => void;
  leadTypeFilter: string;
  onLeadTypeFilterChange: (type: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (service: string) => void;
  assigneeFilter: string;
  onAssigneeFilterChange: (assignee: string) => void;
  onViewComments: (booking: Booking) => void;
  destinationOptions?: string[];
  assigneeOptions?: string[];
}

const statusColors = {
  upcoming: 'bg-blue-100 text-blue-800 hover:opacity-70 transition-opacity',
  ongoing: 'bg-yellow-100 text-yellow-800 hover:opacity-70 transition-opacity',
  postponed: 'bg-purple-100 text-purple-800 hover:opacity-70 transition-opacity',
  cancelled: 'bg-red-100 text-red-800 hover:opacity-70 transition-opacity',
  completed: 'bg-green-100 text-green-800 hover:opacity-70 transition-opacity',
};



const leadTypeColors = {
  calling: 'bg-blue-100 text-blue-800 hover:opacity-70 transition-opacity',
  instagram: 'bg-pink-100 text-pink-800 hover:opacity-70 transition-opacity',
  referral: 'bg-green-100 text-green-800 hover:opacity-70 transition-opacity',
  website: 'bg-purple-100 text-purple-800 hover:opacity-70 transition-opacity',
  facebook: 'bg-blue-100 text-blue-800 hover:opacity-70 transition-opacity',
  'walk-in': 'bg-orange-100 text-orange-800 hover:opacity-70 transition-opacity',
  other: 'bg-gray-100 text-gray-800 hover:opacity-70 transition-opacity',
};

const serviceColors = {
  'tour-package': 'bg-blue-100 text-blue-800 hover:opacity-70 transition-opacity',
  'flight': 'bg-green-100 text-green-800 hover:opacity-70 transition-opacity',
  'train': 'bg-yellow-100 text-yellow-800 hover:opacity-70 transition-opacity',
  'visa': 'bg-purple-100 text-purple-800 hover:opacity-70 transition-opacity',
  'group-departure': 'bg-pink-100 text-pink-800 hover:opacity-70 transition-opacity',
  'bus': 'bg-orange-100 text-orange-800 hover:opacity-70 transition-opacity',
  'cab': 'bg-red-100 text-red-800 hover:opacity-70 transition-opacity',
  'hotel': 'bg-indigo-100 text-indigo-800 hover:opacity-70 transition-opacity',
};

const getAssigneeColor = (assignee: string): string => {
  const colors = [
    'bg-gray-100 text-gray-800',
    'bg-red-100 text-red-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-orange-100 text-orange-800',
    'bg-teal-100 text-teal-800',
  ];
  
  let hash = 0;
  for (let i = 0; i < assignee.length; i++) {
    hash = ((hash << 5) - hash + assignee.charCodeAt(i)) & 0xffffffff;
  }
  const colorIndex = Math.abs(hash) % colors.length;
  return `${colors[colorIndex]} hover:opacity-70 transition-opacity`;
};

export const BookingTable = ({
  bookings,
  onEdit,
  onView,
  onDelete,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  destinationFilter,
  onDestinationFilterChange,
  leadTypeFilter,
  onLeadTypeFilterChange,
  serviceFilter,
  onServiceFilterChange,
  assigneeFilter,
  onAssigneeFilterChange,
  onViewComments,
  destinationOptions = [],
  assigneeOptions = [],
}: BookingTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast.success('Booking deleted successfully!', {
        style: {
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
    } catch {
      toast.error('Failed to delete booking');
    }
  };

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      upcoming: 'Upcoming',
      ongoing: 'Ongoing',
      postponed: 'Postponed',
      cancelled: 'Cancelled',
      completed: 'Completed',
    };
    return labels[status] || status;
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

  const getServiceLabel = (service: string) => {
    const labels: Record<string, string> = {
      'tour-package': 'Tour Package',
      'flight': 'Flight',
      'train': 'Train',
      'visa': 'Visa',
      'group-departure': 'Group Departure',
      'bus': 'Bus',
      'cab': 'Cab',
      'hotel': 'Hotel',
    };
    return labels[service] || service;
  };

  const getAssigneeLabel = (assignee: string) => {
    if (assignee === 'none') return 'None';
    return assignee;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="postponed">Postponed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={destinationFilter} onValueChange={onDestinationFilterChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Destinations</SelectItem>
            {destinationOptions.map((destination) => (
              <SelectItem key={destination} value={destination}>
                {destination}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>


        <Select value={leadTypeFilter} onValueChange={onLeadTypeFilterChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Lead Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lead Types</SelectItem>
            <SelectItem value="calling">Calling</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="walk-in">Walk-in</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={serviceFilter} onValueChange={onServiceFilterChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="tour-package">Tour Package</SelectItem>
            <SelectItem value="flight">Flight</SelectItem>
            <SelectItem value="train">Train</SelectItem>
            <SelectItem value="visa">Visa</SelectItem>
            <SelectItem value="group-departure">Group Departure</SelectItem>
            <SelectItem value="bus">Bus</SelectItem>
            <SelectItem value="cab">Cab</SelectItem>
            <SelectItem value="hotel">Hotel</SelectItem>
          </SelectContent>
        </Select>

        <Select value={assigneeFilter} onValueChange={onAssigneeFilterChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Travel Advisor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Travel Advisors</SelectItem>
            {assigneeOptions.map((assignee) => (
              <SelectItem key={assignee} value={assignee}>
                {assignee === 'none' ? 'None' : assignee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created Date</TableHead>
              <TableHead>Booking ID</TableHead>
              <TableHead>Travel Advisor</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Travel Start</TableHead>
              <TableHead>Travel End</TableHead>
              <TableHead>Pax</TableHead>
              <TableHead>Lead Type</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Package Cost</TableHead>
              <TableHead>Total Expenses</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} className="text-center py-8 text-gray-500 italic">
                  No bookings found. Confirm a punched-in customer lead to see it here!
                </TableCell>
              </TableRow>
            ) : (
              currentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{formatDate(booking.leadCreationDate)}</TableCell>
                  <TableCell>
                    <code className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-xs font-semibold border border-slate-200 select-all">
                      {booking.bookingId || 'N/A'}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge className={getAssigneeColor(booking.assignee)}>
                      {getAssigneeLabel(booking.assignee)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/booking/${booking.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {booking.name}
                    </Link>
                  </TableCell>
                  <TableCell>{booking.phone}</TableCell>
                  <TableCell>{displayValue(booking.destination)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[booking.status] || 'bg-gray-100 text-gray-800'}>
                      {getStatusLabel(booking.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(booking.travelStartDate)}</TableCell>
                  <TableCell>{formatDate(booking.travelEndDate)}</TableCell>
                  <TableCell>{displayValue(booking.numberOfPax)}</TableCell>

                  <TableCell>
                    <Badge className={leadTypeColors[booking.leadType]}>
                      {getLeadTypeLabel(booking.leadType)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={serviceColors[booking.service]}>
                      {getServiceLabel(booking.service)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ₹{(booking.packageCost || 0).toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="font-semibold text-rose-600">
                    ₹{(booking.expenses || []).reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewComments(booking)}
                      className="flex items-center gap-1"
                    >
                      <MessageSquare className="h-3 w-3" />
                      {booking.comments.length}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(booking)}
                        title="View Details"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {canEditBooking() && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(booking)}
                          title="Edit Booking"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      <RoleGuard allowedRoles={['superadmin']}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete Booking"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </RoleGuard>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
