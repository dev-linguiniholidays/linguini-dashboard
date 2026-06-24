'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Customer } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit, MessageSquare, Save, X, Lock, Check, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuth } from '@/contexts/AuthContext';
import { displayValue, formatDate, formatDateTime } from '@/lib/displayUtils';
import { canEditCustomer, canConfirmBooking, isSuperAdmin, isAdmin } from '@/lib/roleUtils';
import { toast } from 'sonner';

const statusColors = {
  fresh: 'bg-blue-100 text-blue-800 hover:opacity-70 transition-opacity',
  'no-response': 'bg-gray-100 text-gray-800 hover:opacity-70 transition-opacity',
  ongoing: 'bg-yellow-100 text-yellow-800 hover:opacity-70 transition-opacity',
  converted: 'bg-green-100 text-green-800 hover:opacity-70 transition-opacity',
  dead: 'bg-red-100 text-red-800 hover:opacity-70 transition-opacity',
  future: 'bg-purple-100 text-purple-800 hover:opacity-70 transition-opacity',
  hot: 'bg-orange-100 text-orange-800 hover:opacity-70 transition-opacity',
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

export default function CustomerDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const customerId = params.id as string;
  
  const { 
    customers, 
    updateCustomer, 
    addComment, 
    lockCustomer, 
    confirmBooking, 
    isLoading, 
    assigneeOptions = [] 
  } = useCustomers();
  
  const customer = customers.find(c => c.id === customerId);
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    destination: '',
    status: 'fresh' as Customer['status'],
    description: '',
    travelStartDate: '',
    travelEndDate: '',
    leadCreationDate: '',
    numberOfPax: 1,
    leadType: 'calling' as Customer['leadType'],
    service: 'tour-package' as Customer['service'],
    assignee: 'none' as Customer['assignee'],
  });
  const [newComment, setNewComment] = useState('');
  const commentsRef = useRef<HTMLDivElement>(null);

  // Initialize form data when customer is loaded
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        destination: customer.destination,
        status: customer.status,
        description: customer.description,
        travelStartDate: customer.travelStartDate || '',
        travelEndDate: customer.travelEndDate || '',
        leadCreationDate: customer.leadCreationDate ? customer.leadCreationDate.split('T')[0] : '',
        numberOfPax: customer.numberOfPax || 1,
        leadType: customer.leadType,
        service: customer.service,
        assignee: customer.assignee,
      });
    }
  }, [customer]);

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
  }, [searchParams, customer]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

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
      await updateCustomer({
        id: customerId,
        ...formData,
        leadCreationDate: formData.leadCreationDate 
          ? new Date(formData.leadCreationDate).toISOString() 
          : new Date().toISOString(),
      });
      setIsEditing(false);
      router.replace(`/customer/${customerId}`);
      toast.success('Customer updated successfully!', {
        style: {
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
    } catch {
      toast.error('Failed to update customer');
    }
  };

  const handleAddComment = async () => {
    if (!user) return;
    if (newComment.trim()) {
      try {
        await addComment({
          customerId,
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

  const handleLock = async () => {
    try {
      await lockCustomer(customerId);
      toast.success('Lead punched-in successfully!');
    } catch {
      toast.error('Failed to punch in');
    }
  };

  const handleConfirmBooking = async () => {
    try {
      await confirmBooking(customerId);
      toast.success('Lead confirmed and moved to bookings!');
      router.push('/bookings');
    } catch {
      toast.error('Failed to confirm booking');
    }
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-start space-x-4">
          <Link href="/customers">
            <Button variant="outline" size="sm" className="mt-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 flex-wrap">
              {customer.name}
              {customer.isLocked && (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-200 py-1 px-2.5 flex items-center gap-1 text-xs">
                  <Lock className="h-3 w-3" />
                  Locked (Punched In)
                </Badge>
              )}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Destination: <span className="font-semibold text-gray-700">{displayValue(customer.destination)}</span>
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
              <Button onClick={() => { setIsEditing(false); router.replace(`/customer/${customerId}`); }} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            canEditCustomer(customer) && (
              <Button onClick={() => setIsEditing(true)} className="shadow-sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Lead
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
              Lead Profiles & Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="cust-name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="cust-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{customer.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cust-phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="cust-phone"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{customer.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cust-lead-creation">Lead Created Date</Label>
                  {isEditing ? (
                    <Input
                      id="cust-lead-creation"
                      type="date"
                      value={formData.leadCreationDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, leadCreationDate: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{formatDate(customer.leadCreationDate)}</p>
                  )}
                </div>
              </div>

              {/* Travel Specification */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Travel plans</h3>

                <div className="space-y-2">
                  <Label htmlFor="cust-destination">Destination</Label>
                  {isEditing ? (
                    <Input
                      id="cust-destination"
                      value={formData.destination}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{displayValue(customer.destination)}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cust-start-date">Start Date</Label>
                    {isEditing ? (
                      <Input
                        id="cust-start-date"
                        type="date"
                        value={formData.travelStartDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, travelStartDate: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{formatDate(customer.travelStartDate)}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cust-end-date">End Date</Label>
                    {isEditing ? (
                      <Input
                        id="cust-end-date"
                        type="date"
                        value={formData.travelEndDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, travelEndDate: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{formatDate(customer.travelEndDate)}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cust-pax">Passengers (Pax)</Label>
                  {isEditing ? (
                    <Input
                      id="cust-pax"
                      type="number"
                      min="1"
                      value={formData.numberOfPax}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfPax: parseInt(e.target.value) || 1 }))}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{displayValue(customer.numberOfPax)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Categorization & Advisor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <Label>Lead Type</Label>
                {isEditing ? (
                  <Select value={formData.leadType} onValueChange={(value) => setFormData(prev => ({ ...prev, leadType: value as Customer['leadType'] }))}>
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
                    <Badge className={leadTypeColors[customer.leadType]}>
                      {getLeadTypeLabel(customer.leadType)}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Requested Service</Label>
                {isEditing ? (
                  <Select value={formData.service} onValueChange={(value) => setFormData(prev => ({ ...prev, service: value as Customer['service'] }))}>
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
                    <Badge className={serviceColors[customer.service]}>
                      {getServiceLabel(customer.service)}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Travel Advisor (Assignee)</Label>
                {isEditing && (isSuperAdmin() || isAdmin()) ? (
                  assigneeOptions.length === 0 ? (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading advisors...</span>
                    </div>
                  ) : (
                    <Select value={formData.assignee} onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value as Customer['assignee'] }))}>
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
                    <Badge className={getAssigneeColor(customer.assignee)}>
                      {getAssigneeLabel(customer.assignee)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Description Details */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <Label htmlFor="cust-description">Detailed Requirements</Label>
              {isEditing ? (
                <Textarea
                  id="cust-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="resize-none"
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700 min-h-[100px] whitespace-pre-line">
                  {displayValue(customer.description, 'No detailed description provided.')}
                </div>
              )}
            </div>

            <div className="text-xs text-gray-400 text-right pt-2">
              Last updated: {formatDateTime(customer.updatedAt)}
            </div>
          </div>
        </div>

        {/* Right Side: Status Updates, Quick Actions, and Comments */}
        <div className="space-y-6">
          {/* Status & Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              Lead Control Panel
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-sm font-medium text-gray-600">Lead Status</span>
                {isEditing ? (
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Customer['status'] }))}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fresh">Fresh</SelectItem>
                      <SelectItem value="no-response">No Response</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="dead">Dead</SelectItem>
                      <SelectItem value="future">Future</SelectItem>
                      <SelectItem value="hot">Hot</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={statusColors[customer.status]}>
                    {getStatusLabel(customer.status)}
                  </Badge>
                )}
              </div>

              {/* Actions Section */}
              <div className="pt-2">
                {!customer.isLocked && (
                  <Button
                    onClick={handleLock}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white shadow-sm text-xs font-semibold flex items-center justify-center gap-1.5 h-10"
                  >
                    <Lock className="h-4 w-4" />
                    Punch In (Lock Lead)
                  </Button>
                )}

                {customer.isLocked && (
                  canConfirmBooking() ? (
                    <Button
                      onClick={handleConfirmBooking}
                      className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm text-xs font-semibold flex items-center justify-center gap-1.5 h-10"
                    >
                      <Check className="h-4 w-4" />
                      Confirm Booking & Move
                    </Button>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 flex items-start gap-2.5 text-xs">
                      <Lock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Locked by Assigned Advisor</p>
                        <p className="text-[10px] text-amber-700/80 mt-0.5">Only administrative roles can authorize confirm booking movements.</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Comments Timeline Section */}
          <div ref={commentsRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[480px]">
            <div className="flex items-center gap-2 border-b pb-3 mb-4 shrink-0">
              <MessageSquare className="h-5 w-5 text-gray-500" />
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                Comments ({customer.comments.length})
              </h3>
            </div>

            {/* Comment Stream Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
              {customer.comments.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-gray-400 italic text-xs py-8">
                  No comments logged yet.
                </div>
              ) : (
                customer.comments.map((comment) => (
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
            {canEditCustomer(customer) && (
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