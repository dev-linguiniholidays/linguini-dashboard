'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Customer } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Trash2, Eye, MessageSquare } from 'lucide-react';
import { RoleGuard } from './RoleGuard';
import { statusOptions, destinationOptions, packageTypeOptions, leadTypeOptions } from '@/lib/mockData';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onView: (customer: Customer) => void;
  onComment: (customer: Customer) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  destinationFilter: string;
  onDestinationFilterChange: (destination: string) => void;
  packageTypeFilter: string;
  onPackageTypeFilterChange: (packageType: string) => void;
  leadTypeFilter: string;
  onLeadTypeFilterChange: (leadType: string) => void;
}

export const CustomerTable = ({
  customers,
  onEdit,
  onDelete,
  onView,
  onComment,
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
}: CustomerTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue('phone')}</div>
      ),
    },
    {
      accessorKey: 'destination',
      header: 'Destination',
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue('destination')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const statusColors = {
          fresh: 'bg-blue-100 text-blue-800',
          'no-response': 'bg-gray-100 text-gray-800',
          ongoing: 'bg-yellow-100 text-yellow-800',
          converted: 'bg-green-100 text-green-800',
          dead: 'bg-red-100 text-red-800',
          future: 'bg-purple-100 text-purple-800',
          hot: 'bg-orange-100 text-orange-800',
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {status === 'no-response' ? 'No Response' : status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: 'travelStartDate',
      header: 'Travel Start',
      cell: ({ row }) => {
        const date = new Date(row.getValue('travelStartDate'));
        return (
          <div className="text-sm">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: 'travelEndDate',
      header: 'Travel End',
      cell: ({ row }) => {
        const date = new Date(row.getValue('travelEndDate'));
        return (
          <div className="text-sm">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: 'numberOfPax',
      header: 'Pax',
      cell: ({ row }) => (
        <div className="text-sm font-medium">
          {row.getValue('numberOfPax')}
        </div>
      ),
    },
    {
      accessorKey: 'packageType',
      header: 'Package',
      cell: ({ row }) => {
        const packageType = row.getValue('packageType') as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            packageType === 'private' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {packageType.charAt(0).toUpperCase() + packageType.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: 'leadType',
      header: 'Lead Type',
      cell: ({ row }) => {
        const leadType = row.getValue('leadType') as string;
        const leadTypeColors = {
          calling: 'bg-green-100 text-green-800',
          instagram: 'bg-pink-100 text-pink-800',
          referral: 'bg-blue-100 text-blue-800',
          website: 'bg-gray-100 text-gray-800',
          facebook: 'bg-blue-100 text-blue-800',
          'walk-in': 'bg-yellow-100 text-yellow-800',
          other: 'bg-gray-100 text-gray-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            leadTypeColors[leadType as keyof typeof leadTypeColors] || 'bg-gray-100 text-gray-800'
          }`}>
            {leadType === 'walk-in' ? 'Walk-in' : leadType.charAt(0).toUpperCase() + leadType.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: 'comments',
      header: 'Comments',
      cell: ({ row }) => {
        const comments = row.getValue('comments') as any[];
        return (
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600">{comments.length}</span>
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </div>
        );
      },
    },
    {
      accessorKey: 'leadCreationDate',
      header: 'Lead Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('leadCreationDate'));
        return (
          <div className="text-sm text-gray-500">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {row.getValue('description')}
        </div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated',
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'));
        return (
          <div className="text-sm text-gray-500">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(customer)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onComment(customer)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(customer)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <RoleGuard allowedRoles={['admin']}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(customer.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </RoleGuard>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={destinationFilter} onValueChange={onDestinationFilterChange}>
            <SelectTrigger className="w-40">
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
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Package" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Packages</SelectItem>
              {packageTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={leadTypeFilter} onValueChange={onLeadTypeFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Lead Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Lead Types</SelectItem>
              {leadTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} customers
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
