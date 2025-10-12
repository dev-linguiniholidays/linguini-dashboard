'use client';

import { useState, useEffect } from 'react';
import { Customer } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Save, X, MessageSquare, Send } from 'lucide-react';
import { displayValue, formatDate, formatDateTime } from '@/lib/displayUtils';
import { toast } from 'sonner';

interface CustomerDetailsProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Customer>) => void;
  onAddComment: (customerId: string, text: string) => void;
  isLoading?: boolean;
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

export const CustomerDetails = ({
  customer,
  isOpen,
  onClose,
  onUpdate,
  onAddComment,
  isLoading = false,
}: CustomerDetailsProps) => {
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
    packageType: 'private' as Customer['packageType'],
    leadType: 'calling' as Customer['leadType'],
  });
  const [newComment, setNewComment] = useState('');

  const handlePhoneChange = (value: string) => {
    // Remove all non-digit characters except +
    let cleanValue = value.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +91, add it
    if (!cleanValue.startsWith('+91')) {
      if (cleanValue.startsWith('91')) {
        cleanValue = '+' + cleanValue;
      } else if (cleanValue.startsWith('+')) {
        cleanValue = '+91' + cleanValue.substring(1);
      } else {
        cleanValue = '+91' + cleanValue;
      }
    }
    
    // Limit to 10 digits after +91
    if (cleanValue.length > 13) { // +91 + 10 digits
      cleanValue = cleanValue.substring(0, 13);
    }
    
    // Add space after +91 for better readability
    if (cleanValue.length > 3) {
      cleanValue = cleanValue.substring(0, 3) + ' ' + cleanValue.substring(3);
    }
    
    setFormData(prev => ({ ...prev, phone: cleanValue }));
  };

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        destination: customer.destination,
        status: customer.status,
        description: customer.description,
        travelStartDate: customer.travelStartDate,
        travelEndDate: customer.travelEndDate,
        leadCreationDate: customer.leadCreationDate.split('T')[0],
        numberOfPax: customer.numberOfPax,
        packageType: customer.packageType,
        leadType: customer.leadType,
      });
    }
  }, [customer]);

  const handleSave = async () => {
    try {
      await onUpdate(customer.id, {
        ...formData,
        leadCreationDate: new Date(formData.leadCreationDate).toISOString(),
      });
      setIsEditing(false);
      toast.success('Customer updated successfully!', {
        style: {
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
    } catch (_error) {
      toast.error('Failed to update customer');
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await onAddComment(customer.id, newComment.trim());
        setNewComment('');
        toast.success('Comment added successfully!', {
          style: {
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
          },
        });
        // Auto-close the modal after adding comment
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (_error) {
        toast.error('Failed to add comment');
      }
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Customer Details
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
                <Button onClick={() => setIsEditing(true)} size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
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
                <p className="text-sm font-medium">{customer.name}</p>
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
                <p className="text-sm font-medium">{customer.phone}</p>
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
                <p className="text-sm font-medium">{displayValue(customer.destination)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              {isEditing ? (
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Customer['status'] }))}>
                  <SelectTrigger>
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

            <div className="space-y-2">
              <Label>Travel Start Date</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.travelStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, travelStartDate: e.target.value }))}
                />
              ) : (
                <p className="text-sm font-medium">{formatDate(customer.travelStartDate)}</p>
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
                <p className="text-sm font-medium">{formatDate(customer.travelEndDate)}</p>
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
                <p className="text-sm font-medium">{displayValue(customer.numberOfPax)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Package Type</Label>
              {isEditing ? (
                <Select value={formData.packageType} onValueChange={(value) => setFormData(prev => ({ ...prev, packageType: value as Customer['packageType'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={packageTypeColors[customer.packageType]}>
                  {getPackageTypeLabel(customer.packageType)}
                </Badge>
              )}
            </div>

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
                <Badge className={leadTypeColors[customer.leadType]}>
                  {getLeadTypeLabel(customer.leadType)}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label>Lead Creation Date</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.leadCreationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, leadCreationDate: e.target.value }))}
                />
              ) : (
                <p className="text-sm font-medium">{formatDate(customer.leadCreationDate)}</p>
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
              <p className="text-sm text-gray-600">{displayValue(customer.description, 'No description provided')}</p>
            )}
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Comments ({customer.comments.length})</h3>
            </div>

            {/* Add Comment */}
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

            {/* Comments List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {customer.comments.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No comments yet</p>
              ) : (
                customer.comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.userName}</span>
                        <span className="text-xs text-gray-500">
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

          {/* Last Updated */}
          <div className="text-xs text-gray-500 border-t pt-4">
            Last updated: {formatDateTime(customer.updatedAt)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};