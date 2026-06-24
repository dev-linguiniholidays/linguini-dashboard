'use client';

import { useState, useEffect } from 'react';
import { Booking, Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Save, X, MessageSquare, Send, Loader2, Receipt, Trash2, Plus } from 'lucide-react';
import { displayValue, formatDate, formatDateTime } from '@/lib/displayUtils';
import { canEditBooking, isSuperAdmin, isAdmin } from '@/lib/roleUtils';
import { toast } from 'sonner';

interface BookingDetailsProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Booking>) => void;
  onAddComment: (bookingId: string, text: string) => void;
  onAddExpense?: (bookingId: string, amount: number, category: Expense['category'], description: string) => Promise<void>;
  onDeleteExpense?: (bookingId: string, expenseId: string) => Promise<void>;
  isLoading?: boolean;
  assigneeOptions?: string[];
  commentMode?: boolean;
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

export const BookingDetails = ({
  booking,
  isOpen,
  onClose,
  onUpdate,
  onAddComment,
  onAddExpense,
  onDeleteExpense,
  isLoading = false,
  assigneeOptions = [],
  commentMode = false,
}: BookingDetailsProps) => {
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

  useEffect(() => {
    if (booking) {
      setFormData({
        name: booking.name,
        phone: booking.phone,
        destination: booking.destination,
        status: booking.status,
        description: booking.description,
        travelStartDate: booking.travelStartDate,
        travelEndDate: booking.travelEndDate,
        leadCreationDate: booking.leadCreationDate.split('T')[0],
        numberOfPax: booking.numberOfPax,
        leadType: booking.leadType,
        service: booking.service,
        assignee: booking.assignee,
        packageCost: booking.packageCost || 0,
      });
    }
  }, [booking]);

  const handleSave = async () => {
    try {
      await onUpdate(booking.id, {
        ...formData,
        leadCreationDate: new Date(formData.leadCreationDate).toISOString(),
      });
      setIsEditing(false);
      toast.success('Booking updated successfully!', {
        style: {
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await onAddComment(booking.id, newComment.trim());
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
    const amt = parseFloat(expenseAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid expense amount');
      return;
    }
    if (onAddExpense) {
      setIsAddingExpense(true);
      try {
        await onAddExpense(booking.id, amt, expenseCategory, expenseDescription.trim());
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
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (onDeleteExpense) {
      try {
        await onDeleteExpense(booking.id, expenseId);
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

  const editable = canEditBooking();
  const expenses = booking.expenses || [];
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none md:max-w-4xl md:max-h-[90vh] md:w-auto md:h-auto overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg md:text-xl font-semibold">
              Booking Details
            </DialogTitle>
            <div className="flex gap-3 mr-8">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={isLoading} size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              ) : (
                !commentMode && editable && (
                  <Button onClick={() => setIsEditing(true)} size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <p className="text-sm font-medium">{booking.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+91 9876543210"
                />
              ) : (
                <p className="text-sm font-medium">{booking.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Destination</Label>
              {isEditing ? (
                <Input
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                />
              ) : (
                <p className="text-sm font-medium">{displayValue(booking.destination)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              {isEditing ? (
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Booking['status'] }))}>
                  <SelectTrigger>
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

            <div className="space-y-2">
              <Label>Travel Start Date</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.travelStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, travelStartDate: e.target.value }))}
                />
              ) : (
                <p className="text-sm font-medium">{formatDate(booking.travelStartDate)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Travel End Date</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.travelEndDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, travelEndDate: e.target.value }))}
                />
              ) : (
                <p className="text-sm font-medium">{formatDate(booking.travelEndDate)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Number of Passengers</Label>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  value={formData.numberOfPax}
                  onChange={(e) => setFormData(prev => ({ ...prev, numberOfPax: parseInt(e.target.value) || 1 }))}
                />
              ) : (
                <p className="text-sm font-medium">{displayValue(formData.numberOfPax)}</p>
              )}
            </div>

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
                <Badge className={leadTypeColors[booking.leadType]}>
                  {getLeadTypeLabel(booking.leadType)}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label>Service</Label>
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
                <Badge className={serviceColors[booking.service]}>
                  {getServiceLabel(booking.service)}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label>Travel Advisor</Label>
              {isEditing && (isSuperAdmin() || isAdmin()) ? (
                assigneeOptions.length === 0 ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading travel advisor options...</span>
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
                <Badge className={getAssigneeColor(booking.assignee)}>
                  {getAssigneeLabel(booking.assignee)}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label>Booking Created Date</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.leadCreationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, leadCreationDate: e.target.value }))}
                />
              ) : (
                <p className="text-sm font-medium">{formatDate(booking.leadCreationDate)}</p>
              )}
            </div>

            {/* Package Cost */}
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
                <p className="text-sm font-semibold text-gray-900">₹{(booking.packageCost || 0).toLocaleString('en-IN')}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            {isEditing ? (
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-600">{displayValue(booking.description, 'No description provided')}</p>
            )}
          </div>

          {/* Side by side log: Comments & Tagged Expenses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Comments ({booking.comments.length})</h3>
              </div>

              {/* Add Comment */}
              {editable && (
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {booking.comments.length === 0 ? (
                  <p className="text-sm text-gray-500 italic py-2">No comments yet</p>
                ) : (
                  booking.comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.userName}</span>
                          <span className="text-[10px] text-gray-500">
                            {formatDateTime(comment.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tagged Expenses Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold">Expenses Log</h3>
                </div>
                <div className="text-sm font-semibold bg-rose-50 text-rose-700 px-3 py-1 rounded-full border border-rose-200 shadow-sm">
                  Total: ₹{totalExpenses.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Add Expense (Admin/Superadmin only) */}
              {editable && (
                <div className="space-y-2 border rounded-lg p-3 bg-gray-50/50">
                  <span className="text-xs font-semibold text-gray-500">Log New Expense</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="number"
                        placeholder="Amount (₹)"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Select
                        value={expenseCategory}
                        onValueChange={(val) => setExpenseCategory(val as typeof expenseCategory)}
                      >
                        <SelectTrigger className="h-9">
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
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Expense description/notes..."
                      value={expenseDescription}
                      onChange={(e) => setExpenseDescription(e.target.value)}
                      className="h-9 flex-1"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleAddExpense} 
                      disabled={isAddingExpense || !expenseAmount.trim()}
                      className="h-9 px-3"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              )}

              {/* Expenses List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {expenses.length === 0 ? (
                  <p className="text-sm text-gray-500 italic py-2">No expenses logged yet</p>
                ) : (
                  [...expenses].reverse().map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between border rounded-lg p-2.5 bg-white shadow-sm hover:border-gray-300 transition-colors">
                      <div className="space-y-1 flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryColors[expense.category] || 'bg-gray-100 text-gray-700'}`}>
                            {expense.category}
                          </span>
                          <span className="font-semibold text-sm text-gray-900">
                            ₹{expense.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        {expense.description && (
                          <p className="text-xs text-gray-600 truncate" title={expense.description}>
                            {expense.description}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-400">
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
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-gray-500 border-t pt-4">
            Last updated: {formatDateTime(booking.updatedAt)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
