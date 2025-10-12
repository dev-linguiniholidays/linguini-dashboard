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
  onViewComments: (customer: Customer) => void;
}

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
  onViewComments,
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

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
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
            <SelectItem value="Paris, France">Paris, France</SelectItem>
            <SelectItem value="Tokyo, Japan">Tokyo, Japan</SelectItem>
            <SelectItem value="Bali, Indonesia">Bali, Indonesia</SelectItem>
            <SelectItem value="Rome, Italy">Rome, Italy</SelectItem>
            <SelectItem value="New York, USA">New York, USA</SelectItem>
            <SelectItem value="Dubai, UAE">Dubai, UAE</SelectItem>
            <SelectItem value="London, UK">London, UK</SelectItem>
            <SelectItem value="Barcelona, Spain">Barcelona, Spain</SelectItem>
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

        <Button onClick={onAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
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