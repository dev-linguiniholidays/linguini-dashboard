'use client';

import { useState, useEffect } from 'react';
import { Customer } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CustomerFormProps {
  customer?: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id' | 'updatedAt' | 'comments'>) => void;
  onUpdate?: (id: string, updates: Partial<Customer>) => void;
  isLoading?: boolean;
}

export const CustomerForm = ({
  customer,
  isOpen,
  onClose,
  onSave,
  onUpdate,
  isLoading = false,
}: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    destination: '',
    status: 'fresh' as Customer['status'],
    description: '',
    travelStartDate: '',
    travelEndDate: '',
    leadCreationDate: new Date().toISOString().split('T')[0],
    numberOfPax: 1,
    packageType: 'private' as Customer['packageType'],
    leadType: 'calling' as Customer['leadType'],
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
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        destination: '',
        status: 'fresh',
        description: '',
        travelStartDate: '',
        travelEndDate: '',
        leadCreationDate: new Date().toISOString().split('T')[0],
        numberOfPax: 1,
        packageType: 'private',
        leadType: 'calling',
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
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.travelStartDate) {
      newErrors.travelStartDate = 'Travel start date is required';
    }

    if (!formData.travelEndDate) {
      newErrors.travelEndDate = 'Travel end date is required';
    }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const customerData = {
      ...formData,
      leadCreationDate: new Date(formData.leadCreationDate).toISOString(),
    };

    if (customer && onUpdate) {
      onUpdate(customer.id, customerData);
    } else {
      onSave(customerData);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
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
              <Label htmlFor="travelStartDate">Travel Start Date *</Label>
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
              <Label htmlFor="travelEndDate">Travel End Date *</Label>
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
              <Label htmlFor="numberOfPax">Number of Passengers *</Label>
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