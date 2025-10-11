'use client';

import { Customer, Comment } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Edit, X, MessageSquare, Send } from 'lucide-react';
import { statusOptions, destinationOptions, packageTypeOptions, leadTypeOptions } from '@/lib/mockData';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/roleUtils';

interface CustomerDetailsProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Customer>) => void;
  onAddComment: (customerId: string, text: string, userId: string, userName: string) => void;
  isLoading?: boolean;
}

export const CustomerDetails = ({
  customer,
  isOpen,
  onClose,
  onUpdate,
  onAddComment,
  isLoading = false,
}: CustomerDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    destination: '',
    status: 'fresh' as const,
    description: '',
    travelStartDate: '',
    travelEndDate: '',
    leadCreationDate: '',
    numberOfPax: 1,
    packageType: 'private' as const,
    leadType: 'calling' as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when customer changes
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
        leadCreationDate: customer.leadCreationDate,
        numberOfPax: customer.numberOfPax,
        packageType: customer.packageType,
        leadType: customer.leadType,
      });
    }
  }, [customer]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!customer || !validateForm()) {
      return;
    }

    onUpdate(customer.id, formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        destination: customer.destination,
        status: customer.status,
        description: customer.description,
        travelStartDate: customer.travelStartDate,
        travelEndDate: customer.travelEndDate,
        leadCreationDate: customer.leadCreationDate,
        numberOfPax: customer.numberOfPax,
        packageType: customer.packageType,
        leadType: customer.leadType,
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddComment = () => {
    if (!customer || !newComment.trim()) return;
    
    const currentUser = getCurrentUser();
    onAddComment(customer.id, newComment.trim(), currentUser.id, currentUser.name);
    setNewComment('');
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Customer Details</DialogTitle>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{customer.name}</div>
              )}
              {isEditing && errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{customer.phone}</div>
              )}
              {isEditing && errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              {isEditing ? (
                <Select
                  value={formData.destination}
                  onValueChange={(value) => handleInputChange('destination', value)}
                >
                  <SelectTrigger className={errors.destination ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationOptions.map((destination) => (
                      <SelectItem key={destination} value={destination}>
                        {destination}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{customer.destination}</div>
              )}
              {isEditing && errors.destination && (
                <p className="text-sm text-red-500">{errors.destination}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'fresh' ? 'bg-blue-100 text-blue-800' :
                    customer.status === 'no-response' ? 'bg-gray-100 text-gray-800' :
                    customer.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                    customer.status === 'converted' ? 'bg-green-100 text-green-800' :
                    customer.status === 'dead' ? 'bg-red-100 text-red-800' :
                    customer.status === 'future' ? 'bg-purple-100 text-purple-800' :
                    customer.status === 'hot' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.status === 'no-response' ? 'No Response' : customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={errors.description ? 'border-red-500' : ''}
                rows={4}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md min-h-[100px]">
                {customer.description}
              </div>
            )}
            {isEditing && errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travelStartDate">Travel Start Date</Label>
              {isEditing ? (
                <Input
                  id="travelStartDate"
                  type="date"
                  value={formData.travelStartDate}
                  onChange={(e) => handleInputChange('travelStartDate', e.target.value)}
                  className={errors.travelStartDate ? 'border-red-500' : ''}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {new Date(customer.travelStartDate).toLocaleDateString()}
                </div>
              )}
              {isEditing && errors.travelStartDate && (
                <p className="text-sm text-red-500">{errors.travelStartDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelEndDate">Travel End Date</Label>
              {isEditing ? (
                <Input
                  id="travelEndDate"
                  type="date"
                  value={formData.travelEndDate}
                  onChange={(e) => handleInputChange('travelEndDate', e.target.value)}
                  className={errors.travelEndDate ? 'border-red-500' : ''}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {new Date(customer.travelEndDate).toLocaleDateString()}
                </div>
              )}
              {isEditing && errors.travelEndDate && (
                <p className="text-sm text-red-500">{errors.travelEndDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfPax">Number of Passengers</Label>
              {isEditing ? (
                <Input
                  id="numberOfPax"
                  type="number"
                  min="1"
                  value={formData.numberOfPax}
                  onChange={(e) => handleInputChange('numberOfPax', e.target.value)}
                  className={errors.numberOfPax ? 'border-red-500' : ''}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{customer.numberOfPax}</div>
              )}
              {isEditing && errors.numberOfPax && (
                <p className="text-sm text-red-500">{errors.numberOfPax}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="packageType">Package Type</Label>
              {isEditing ? (
                <Select
                  value={formData.packageType}
                  onValueChange={(value) => handleInputChange('packageType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select package type" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.packageType === 'private' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {customer.packageType.charAt(0).toUpperCase() + customer.packageType.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadType">Lead Type</Label>
            {isEditing ? (
              <Select
                value={formData.leadType}
                onValueChange={(value) => handleInputChange('leadType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead type" />
                </SelectTrigger>
                <SelectContent>
                  {leadTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-2 bg-gray-50 rounded-md">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  customer.leadType === 'calling' ? 'bg-green-100 text-green-800' :
                  customer.leadType === 'instagram' ? 'bg-pink-100 text-pink-800' :
                  customer.leadType === 'referral' ? 'bg-blue-100 text-blue-800' :
                  customer.leadType === 'website' ? 'bg-gray-100 text-gray-800' :
                  customer.leadType === 'facebook' ? 'bg-blue-100 text-blue-800' :
                  customer.leadType === 'walk-in' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {customer.leadType === 'walk-in' ? 'Walk-in' : customer.leadType.charAt(0).toUpperCase() + customer.leadType.slice(1)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Lead Creation Date</Label>
            <div className="p-2 bg-gray-50 rounded-md">
              {new Date(customer.leadCreationDate).toLocaleString()}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Last Updated</Label>
            <div className="p-2 bg-gray-50 rounded-md">
              {new Date(customer.updatedAt).toLocaleString()}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <Label className="text-lg font-semibold">Comments ({customer.comments.length})</Label>
            </div>
            
            {/* Add Comment */}
            <div className="space-y-2">
              <Label htmlFor="newComment">Add Comment</Label>
              <div className="flex space-x-2">
                <Textarea
                  id="newComment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isLoading}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {customer.comments.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No comments yet. Add the first comment above.
                </div>
              ) : (
                customer.comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm">{comment.userName}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">{comment.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
