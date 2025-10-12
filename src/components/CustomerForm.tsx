'use client';

import { useState, useEffect } from 'react';
import { Customer } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { isAdmin } from '@/lib/roleUtils';
import { toast } from 'sonner';

interface CustomerFormProps {
  customer?: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id' | 'updatedAt' | 'comments'>) => void;
  onUpdate?: (id: string, updates: Partial<Customer>) => void;
  isLoading?: boolean;
  assigneeOptions?: string[];
}

export const CustomerForm = ({
  customer,
  isOpen,
  onClose,
  onSave,
  onUpdate,
  isLoading = false,
  assigneeOptions = [],
}: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '+91 ',
    destination: '',
    status: 'fresh' as Customer['status'],
    description: '',
    travelStartDate: '',
    travelEndDate: '',
    leadCreationDate: new Date().toISOString().split('T')[0],
    numberOfPax: 1,
    packageType: 'private' as Customer['packageType'],
    leadType: 'calling' as Customer['leadType'],
    service: 'tour-package' as Customer['service'],
    assignee: 'none' as Customer['assignee'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
        service: customer.service,
        assignee: customer.assignee,
      });
    } else {
      setFormData({
        name: '',
        phone: '+91 ',
        destination: '',
        status: 'fresh',
        description: '',
        travelStartDate: '',
        travelEndDate: '',
        leadCreationDate: new Date().toISOString().split('T')[0],
        numberOfPax: 1,
        packageType: 'private',
        leadType: 'calling',
        service: 'tour-package',
        assignee: 'none',
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else {
      // Remove spaces and check for Indian phone number format
      const cleanPhone = formData.phone.replace(/\s/g, '');
      const indianPhoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
      
      if (!indianPhoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // Only validate date logic if both dates are provided
    if (formData.travelStartDate && formData.travelEndDate) {
      const startDate = new Date(formData.travelStartDate);
      const endDate = new Date(formData.travelEndDate);
      if (endDate <= startDate) {
        newErrors.travelEndDate = 'End date must be after start date';
      }
    }

    if (formData.numberOfPax < 1) {
      newErrors.numberOfPax = 'Number of passengers must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const customerData = {
      ...formData,
      leadCreationDate: new Date(formData.leadCreationDate).toISOString(),
    };

    try {
      if (customer && onUpdate) {
        await onUpdate(customer.id, customerData);
        toast.success('Customer updated successfully!', {
          style: {
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
          },
        });
      } else {
        await onSave(customerData);
        toast.success('Customer added successfully!', {
          style: {
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
          },
        });
      }
      onClose();
    } catch (_error) {
      toast.error(customer ? 'Failed to update customer' : 'Failed to add customer');
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+91 9876543210"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className={errors.destination ? 'border-red-500' : ''}
              />
              {errors.destination && <p className="text-sm text-red-500">{errors.destination}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelStartDate">Travel Start Date</Label>
              <Input
                id="travelStartDate"
                type="date"
                value={formData.travelStartDate}
                onChange={(e) => handleInputChange('travelStartDate', e.target.value)}
                className={errors.travelStartDate ? 'border-red-500' : ''}
              />
              {errors.travelStartDate && <p className="text-sm text-red-500">{errors.travelStartDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelEndDate">Travel End Date</Label>
              <Input
                id="travelEndDate"
                type="date"
                value={formData.travelEndDate}
                onChange={(e) => handleInputChange('travelEndDate', e.target.value)}
                className={errors.travelEndDate ? 'border-red-500' : ''}
              />
              {errors.travelEndDate && <p className="text-sm text-red-500">{errors.travelEndDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPax">Number of Passengers</Label>
              <Input
                id="numberOfPax"
                type="number"
                min="1"
                value={formData.numberOfPax}
                onChange={(e) => handleInputChange('numberOfPax', parseInt(e.target.value) || 1)}
                className={errors.numberOfPax ? 'border-red-500' : ''}
              />
              {errors.numberOfPax && <p className="text-sm text-red-500">{errors.numberOfPax}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="packageType">Package Type</Label>
              <Select value={formData.packageType} onValueChange={(value) => handleInputChange('packageType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadType">Lead Type</Label>
              <Select value={formData.leadType} onValueChange={(value) => handleInputChange('leadType', value)}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
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
            </div>

            {isAdmin() && (
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                {assigneeOptions.length === 0 ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading assignee options...</span>
                  </div>
                ) : (
                  <Select value={formData.assignee} onValueChange={(value) => handleInputChange('assignee', value)}>
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
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="leadCreationDate">Lead Creation Date</Label>
              <Input
                id="leadCreationDate"
                type="date"
                value={formData.leadCreationDate}
                onChange={(e) => handleInputChange('leadCreationDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : customer ? 'Update' : 'Add'} Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};