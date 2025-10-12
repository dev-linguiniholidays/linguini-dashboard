'use client';

import { useState } from 'react';
import { Customer } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, MessageSquare, Eye } from 'lucide-react';
import { RoleGuard } from './RoleGuard';
import { displayValue } from '@/lib/displayUtils';
import { toast } from 'sonner';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onView: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  destinationFilter: string;
  onDestinationFilterChange: (destination: string) => void;
  packageTypeFilter: string;
  onPackageTypeFilterChange: (type: string) => void;
  leadTypeFilter: string;
  onLeadTypeFilterChange: (type: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (service: string) => void;
  assigneeFilter: string;
  onAssigneeFilterChange: (assignee: string) => void;
  onViewComments: (customer: Customer) => void;
  destinationOptions?: string[];
  assigneeOptions?: string[];
}

const statusColors = {
  fresh: 'bg-blue-100 text-blue-800 hover:opacity-70 transition-opacity',
  'no-response': 'bg-gray-100 text-gray-800 hover:opacity-70 transition-opacity',
  ongoing: 'bg-yellow-100 text-yellow-800 hover:opacity-70 transition-opacity',
  converted: 'bg-green-100 text-green-800 hover:opacity-70 transition-opacity',
  dead: 'bg-red-100 text-red-800 hover:opacity-70 transition-opacity',
  future: 'bg-purple-100 text-purple-800 hover:opacity-70 transition-opacity',
  hot: 'bg-orange-100 text-orange-800 hover:opacity-70 transition-opacity',
};

const packageTypeColors = {
  private: 'bg-indigo-100 text-indigo-800 hover:opacity-70 transition-opacity',
  group: 'bg-pink-100 text-pink-800 hover:opacity-70 transition-opacity',
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

const assigneeColors = {
  'none': 'bg-gray-100 text-gray-800 hover:opacity-70 transition-opacity',
  'admin': 'bg-red-100 text-red-800 hover:opacity-70 transition-opacity',
  'user1': 'bg-blue-100 text-blue-800 hover:opacity-70 transition-opacity',
  'user2': 'bg-green-100 text-green-800 hover:opacity-70 transition-opacity',
  'user3': 'bg-yellow-100 text-yellow-800 hover:opacity-70 transition-opacity',
  'user4': 'bg-purple-100 text-purple-800 hover:opacity-70 transition-opacity',
};

export const CustomerTable = ({
  customers,
  onEdit,
  onView,
  onDelete,
  onAdd,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  destinationFilter,
  onDestinationFilterChange,
  packageTypeFilter,
  onPackageTypeFilterChange,
  leadTypeFilter,
  onLeadTypeFilterChange,
  serviceFilter,
  onServiceFilterChange,
  assigneeFilter,
  onAssigneeFilterChange,
  onViewComments,
  destinationOptions = [],
  assigneeOptions = [],
}: CustomerTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast.success('Customer deleted successfully!', {
        style: {
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
    } catch (_error) {
      toast.error('Failed to delete customer');
    }
  };

  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = customers.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
    return assignee; // Use the actual name from the database
  };

  return (
    <div className="space-y-4">
      {/* Search and Add Customer */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="fresh">Fresh</SelectItem>
            <SelectItem value="no-response">No Response</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="dead">Dead</SelectItem>
            <SelectItem value="future">Future</SelectItem>
            <SelectItem value="hot">Hot</SelectItem>
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

        <Select value={packageTypeFilter} onValueChange={onPackageTypeFilterChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Package" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Packages</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="group">Group</SelectItem>
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
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
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
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Travel Start</TableHead>
              <TableHead>Travel End</TableHead>
              <TableHead>Pax</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Lead Type</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Lead Created</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{displayValue(customer.destination)}</TableCell>
                <TableCell>
                  <Badge className={statusColors[customer.status]}>
                    {getStatusLabel(customer.status)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(customer.travelStartDate)}</TableCell>
                <TableCell>{formatDate(customer.travelEndDate)}</TableCell>
                <TableCell>{displayValue(customer.numberOfPax)}</TableCell>
                <TableCell>
                  <Badge className={packageTypeColors[customer.packageType]}>
                    {getPackageTypeLabel(customer.packageType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={leadTypeColors[customer.leadType]}>
                    {getLeadTypeLabel(customer.leadType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={serviceColors[customer.service]}>
                    {getServiceLabel(customer.service)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={assigneeColors[customer.assignee]}>
                    {getAssigneeLabel(customer.assignee)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(customer.leadCreationDate)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewComments(customer)}
                    className="flex items-center gap-1"
                  >
                    <MessageSquare className="h-3 w-3" />
                    {customer.comments.length}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(customer)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(customer)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <RoleGuard allowedRoles={['admin']}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </RoleGuard>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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