'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Booking, Expense } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit, MessageSquare, Save, X, Send, Loader2, Receipt, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { displayValue, formatDate, formatDateTime } from '@/lib/displayUtils';
import { canEditBooking, isSuperAdmin, isAdmin } from '@/lib/roleUtils';
import { toast } from 'sonner';

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
  flight: 'bg-green-100 text-green-800 hover:opacity-70 transition-opacity',
  train: 'bg-yellow-100 text-yellow-800 hover:opacity-70 transition-opacity',
  visa: 'bg-purple-100 text-purple-800 hover:opacity-70 transition-opacity',
  'group-departure': 'bg-pink-100 text-pink-800 hover:opacity-70 transition-opacity',
  bus: 'bg-orange-100 text-orange-800 hover:opacity-70 transition-opacity',
  cab: 'bg-red-100 text-red-800 hover:opacity-70 transition-opacity',
  hotel: 'bg-indigo-100 text-indigo-800 hover:opacity-70 transition-opacity',
};

const categoryColors: Record<string, string> = {
  Hotel: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Taxi: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Bus: 'bg-amber-50 text-amber-700 border-amber-200',
  Guide: 'bg-sky-50 text-sky-700 border-sky-200',
  'Travel Hamper': 'bg-pink-50 text-pink-700 border-pink-200',
  'Medical Kit': 'bg-rose-50 text-rose-700 border-rose-200',
  'Misc.': 'bg-gray-50 text-gray-700 border-gray-200',
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

export default function BookingDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = params.id as string;
  
  const { 
    bookings, 
    updateBooking, 
    addComment, 
    addExpense,
    deleteExpense,
    isLoading, 
    assigneeOptions = [] 
  } = useBookings();
  
  const booking = bookings.find(b => b.id === bookingId);
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    destination: '',
    status: 'upcoming' as Booking['status'],
    description: '',
    travelStartDate: '',
    travelEndDate: '',
    leadCreationDate: '',
    numberOfPax: 1,
    leadType: 'calling' as Booking['leadType'],
    service: 'tour-package' as Booking['service'],
    assignee: 'none' as Booking['assignee'],
    packageCost: 0,
  });
  const [newComment, setNewComment] = useState('');
  
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<Expense['category']>('Hotel');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  
  const commentsRef = useRef<HTMLDivElement>(null);

  // Initialize form data when booking is loaded
  useEffect(() => {
    if (booking) {
      setFormData({
        name: booking.name,
        phone: booking.phone,
        destination: booking.destination,
        status: booking.status,
        description: booking.description,
        travelStartDate: booking.travelStartDate || '',
        travelEndDate: booking.travelEndDate || '',
        leadCreationDate: booking.leadCreationDate ? booking.leadCreationDate.split('T')[0] : '',
        numberOfPax: booking.numberOfPax || 1,
        leadType: booking.leadType,
        service: booking.service,
        assignee: booking.assignee,
        packageCost: booking.packageCost || 0,
      });
    }
  }, [booking]);

  // Handle edit param
  useEffect(() => {
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [searchParams]);

  // Handle scroll to comments tab
  useEffect(() => {
    if (searchParams.get('tab') === 'comments' && commentsRef.current) {
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [searchParams, booking]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">The booking you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/bookings">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePhoneChange = (value: string) => {
    let cleanValue = value.replace(/[^\d+]/g, '');
    if (!cleanValue.startsWith('+91')) {
      if (cleanValue.startsWith('91')) {
        cleanValue = '+' + cleanValue;
      } else if (cleanValue.startsWith('+')) {
        cleanValue = '+91' + cleanValue.substring(1);
      } else {
        cleanValue = '+91' + cleanValue;
      }
    }
    if (cleanValue.length > 13) {
      cleanValue = cleanValue.substring(0, 13);
    }
    if (cleanValue.length > 3) {
      cleanValue = cleanValue.substring(0, 3) + ' ' + cleanValue.substring(3);
    }
    setFormData(prev => ({ ...prev, phone: cleanValue }));
  };

  const handleSave = async () => {
    try {
      await updateBooking({
        id: bookingId,
        ...formData,
        leadCreationDate: formData.leadCreationDate 
          ? new Date(formData.leadCreationDate).toISOString() 
          : new Date().toISOString(),
      });
      setIsEditing(false);
      router.replace(`/booking/${bookingId}`);
      toast.success('Booking updated successfully!', {
        style: {
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
    } catch {
      toast.error('Failed to update booking');
    }
  };

  const handleAddComment = async () => {
    if (!user) return;
    if (newComment.trim()) {
      try {
        await addComment({
          bookingId,
          text: newComment.trim(),
          userId: user.id,
          userName: typeof window !== 'undefined' ? localStorage.getItem('user-name') || 'User' : 'User'
        });
        setNewComment('');
        toast.success('Comment added successfully!', {
          style: {
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
          },
        });
      } catch {
        toast.error('Failed to add comment');
      }
    }
  };

  const handleAddExpense = async () => {
    if (!user) return;
    const amt = parseFloat(expenseAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid expense amount');
      return;
    }
    setIsAddingExpense(true);
    try {
      await addExpense({
        bookingId,
        amount: amt,
        category: expenseCategory,
        description: expenseDescription.trim(),
        userId: user.id,
        userName: typeof window !== 'undefined' ? localStorage.getItem('user-name') || 'User' : 'User'
      });
      setExpenseAmount('');
      setExpenseDescription('');
      toast.success('Expense logged successfully!', {
        style: {
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
    } catch {
      toast.error('Failed to log expense');
    } finally {
      setIsAddingExpense(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(bookingId, expenseId);
      toast.success('Expense deleted successfully!', {
        style: {
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
    } catch {
      toast.error('Failed to delete expense');
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
      flight: 'Flight',
      train: 'Train',
      visa: 'Visa',
      'group-departure': 'Group Departure',
      bus: 'Bus',
      cab: 'Cab',
      hotel: 'Hotel',
    };
    return labels[service] || service;
  };

  const getAssigneeLabel = (assignee: string) => {
    if (assignee === 'none') return 'None';
    return assignee;
  };

  const editable = canEditBooking();
  const expenses = booking.expenses || [];
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-start space-x-4">
          <Link href="/bookings">
            <Button variant="outline" size="sm" className="mt-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 flex-wrap">
              {booking.name}
              <code className="text-xs md:text-sm font-mono font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md select-all">
                {booking.bookingId || 'N/A'}
              </code>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Destination: <span className="font-semibold text-gray-700">{displayValue(booking.destination)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={() => { setIsEditing(false); router.replace(`/booking/${bookingId}`); }} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            editable && (
              <Button onClick={() => setIsEditing(true)} className="shadow-sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Booking
              </Button>
            )
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Details & Requirements Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3">
              Booking Profile & Requirements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact details</h3>
                
                <div className="space-y-2">
                  <Label>Booking ID</Label>
                  <p className="text-sm font-mono font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 select-all">
                    {booking.bookingId || 'N/A'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="book-name">Customer Name</Label>
                  {isEditing ? (
                    <Input
                      id="book-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{booking.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="book-phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="book-phone"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{booking.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="book-creation">Booking Created Date</Label>
                  {isEditing ? (
                    <Input
                      id="book-creation"
                      type="date"
                      value={formData.leadCreationDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, leadCreationDate: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{formatDate(booking.leadCreationDate)}</p>
                  )}
                </div>
              </div>

              {/* Travel Specification */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Travel plans</h3>

                <div className="space-y-2">
                  <Label htmlFor="book-destination">Destination</Label>
                  {isEditing ? (
                    <Input
                      id="book-destination"
                      value={formData.destination}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{displayValue(booking.destination)}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="book-start-date">Start Date</Label>
                    {isEditing ? (
                      <Input
                        id="book-start-date"
                        type="date"
                        value={formData.travelStartDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, travelStartDate: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{formatDate(booking.travelStartDate)}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="book-end-date">End Date</Label>
                    {isEditing ? (
                      <Input
                        id="book-end-date"
                        type="date"
                        value={formData.travelEndDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, travelEndDate: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{formatDate(booking.travelEndDate)}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="book-pax">Passengers (Pax)</Label>
                  {isEditing ? (
                    <Input
                      id="book-pax"
                      type="number"
                      min="1"
                      value={formData.numberOfPax}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfPax: parseInt(e.target.value) || 1 }))}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{displayValue(booking.numberOfPax)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Categorization, Cost & Advisor */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <Label>Lead Type</Label>
                {isEditing ? (
                  <Select value={formData.leadType} onValueChange={(value) => setFormData(prev => ({ ...prev, leadType: value as Booking['leadType'] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calling">Calling</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="walk-in">Walk-in</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="block">
                    <Badge className={leadTypeColors[booking.leadType]}>
                      {getLeadTypeLabel(booking.leadType)}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Service Type</Label>
                {isEditing ? (
                  <Select value={formData.service} onValueChange={(value) => setFormData(prev => ({ ...prev, service: value as Booking['service'] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                ) : (
                  <div className="block">
                    <Badge className={serviceColors[booking.service]}>
                      {getServiceLabel(booking.service)}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Package Cost (₹)</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    min="0"
                    value={formData.packageCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, packageCost: parseFloat(e.target.value) || 0 }))}
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    ₹{(booking.packageCost || 0).toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Travel Advisor</Label>
                {isEditing && (isSuperAdmin() || isAdmin()) ? (
                  assigneeOptions.length === 0 ? (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading advisors...</span>
                    </div>
                  ) : (
                    <Select value={formData.assignee} onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value as Booking['assignee'] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {assigneeOptions.map((assignee) => (
                          <SelectItem key={assignee} value={assignee}>
                            {assignee === 'none' ? 'None' : assignee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )
                ) : (
                  <div className="block">
                    <Badge className={getAssigneeColor(booking.assignee)}>
                      {getAssigneeLabel(booking.assignee)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Description Details */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <Label htmlFor="book-description">Detailed Requirements</Label>
              {isEditing ? (
                <Textarea
                  id="book-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="resize-none"
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700 min-h-[100px] whitespace-pre-line">
                  {displayValue(booking.description, 'No detailed description provided.')}
                </div>
              )}
            </div>

            <div className="text-xs text-gray-400 text-right pt-2">
              Last updated: {formatDateTime(booking.updatedAt)}
            </div>
          </div>
        </div>

        {/* Right Side: Status Updates, Quick Actions, Expenses & Comments */}
        <div className="space-y-6">
          {/* Status Controls Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              Booking Control Panel
            </h3>

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-sm font-medium text-gray-600">Booking Status</span>
              {isEditing ? (
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Booking['status'] }))}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="postponed">Postponed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={statusColors[booking.status] || 'bg-gray-100 text-gray-800'}>
                  {getStatusLabel(booking.status)}
                </Badge>
              )}
            </div>
          </div>

          {/* Tagged Expenses Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[400px]">
            <div className="flex items-center justify-between border-b pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-gray-500" />
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Expenses</h3>
              </div>
              <div className="text-xs font-semibold bg-rose-50 text-rose-700 px-3 py-1 rounded-full border border-rose-200 shadow-sm">
                Total: ₹{totalExpenses.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Expenses List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-4">
              {expenses.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-gray-400 italic text-xs py-8">
                  No expenses logged yet.
                </div>
              ) : (
                [...expenses].reverse().map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-2.5 bg-white shadow-sm hover:border-gray-300 transition-colors">
                    <div className="space-y-1 flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryColors[expense.category] || 'bg-gray-100 text-gray-700'}`}>
                          {expense.category}
                        </span>
                        <span className="font-semibold text-xs text-gray-900">
                          ₹{expense.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {expense.description && (
                        <p className="text-[10px] text-gray-600 truncate" title={expense.description}>
                          {expense.description}
                        </p>
                      )}
                      <p className="text-[9px] text-gray-400">
                        Logged by {expense.userName} on {formatDateTime(expense.timestamp)}
                      </p>
                    </div>
                    {editable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full flex-shrink-0"
                        onClick={() => handleDeleteExpense(expense.id)}
                        title="Delete Expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add Expense (Admin/Superadmin only) */}
            {editable && (
              <div className="shrink-0 border-t border-gray-100 pt-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Amount (₹)"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Select
                    value={expenseCategory}
                    onValueChange={(val) => setExpenseCategory(val as typeof expenseCategory)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                      <SelectItem value="Taxi">Taxi</SelectItem>
                      <SelectItem value="Bus">Bus</SelectItem>
                      <SelectItem value="Guide">Guide</SelectItem>
                      <SelectItem value="Travel Hamper">Travel Hamper</SelectItem>
                      <SelectItem value="Medical Kit">Medical Kit</SelectItem>
                      <SelectItem value="Misc.">Misc.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Expense notes..."
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleAddExpense} 
                    disabled={isAddingExpense || !expenseAmount.trim()}
                    className="h-8 px-3 text-xs bg-slate-900 hover:bg-slate-800"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Comments Timeline Section */}
          <div ref={commentsRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[400px]">
            <div className="flex items-center gap-2 border-b pb-3 mb-4 shrink-0">
              <MessageSquare className="h-5 w-5 text-gray-500" />
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                Comments ({booking.comments.length})
              </h3>
            </div>

            {/* Comment Stream Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
              {booking.comments.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-gray-400 italic text-xs py-8">
                  No comments logged yet.
                </div>
              ) : (
                booking.comments.map((comment) => (
                  <div key={comment.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50 space-y-1">
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-bold text-xs text-gray-800">{comment.userName}</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {formatDateTime(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Post Box */}
            {editable && (
              <div className="shrink-0 flex gap-2 pt-3 border-t border-gray-100">
                <Textarea
                  placeholder="Post comment logs..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="text-xs resize-none"
                />
                <Button 
                  onClick={handleAddComment} 
                  disabled={!newComment.trim()} 
                  className="bg-blue-600 hover:bg-blue-750 text-white shrink-0 self-end h-10 w-10 p-0 flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
