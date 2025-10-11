'use client';

import { useState, useEffect } from 'react';
import { Customer } from '@/lib/mockData';
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
import { statusOptions, destinationOptions, packageTypeOptions, leadTypeOptions } from '@/lib/mockData';

interface CustomerFormProps {
  customer?: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id' | 'updatedAt' | 'comments'>) => void;
  onUpdate?: (id: string, customer: Partial<Customer>) => void;
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
    status: 'fresh' as const,
    description: '',
    travelStartDate: '',
    travelEndDate: '',
    leadCreationDate: new Date().toISOString(),
    numberOfPax: 1,
    packageType: 'private' as const,
    leadType: 'calling' as const,
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
        leadCreationDate: customer.leadCreationDate,
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
        leadCreationDate: new Date().toISOString(),
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
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.travelStartDate) {
      newErrors.travelStartDate = 'Travel start date is required';
    }

    if (!formData.travelEndDate) {
      newErrors.travelEndDate = 'Travel end date is required';
    } else if (formData.travelStartDate && new Date(formData.travelEndDate) <= new Date(formData.travelStartDate)) {
      newErrors.travelEndDate = 'Travel end date must be after start date';
    }

    if (!formData.numberOfPax || formData.numberOfPax < 1) {
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

    if (customer && onUpdate) {
      onUpdate(customer.id, formData);
    } else {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter customer name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination *</Label>
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
            {errors.destination && (
              <p className="text-sm text-red-500">{errors.destination}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter customer description"
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travelStartDate">Travel Start Date *</Label>
              <Input
                id="travelStartDate"
                type="date"
                value={formData.travelStartDate}
                onChange={(e) => handleInputChange('travelStartDate', e.target.value)}
                className={errors.travelStartDate ? 'border-red-500' : ''}
              />
              {errors.travelStartDate && (
                <p className="text-sm text-red-500">{errors.travelStartDate}</p>
              )}
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
              {errors.travelEndDate && (
                <p className="text-sm text-red-500">{errors.travelEndDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfPax">Number of Passengers *</Label>
              <Input
                id="numberOfPax"
                type="number"
                min="1"
                value={formData.numberOfPax}
                onChange={(e) => handleInputChange('numberOfPax', e.target.value)}
                className={errors.numberOfPax ? 'border-red-500' : ''}
              />
              {errors.numberOfPax && (
                <p className="text-sm text-red-500">{errors.numberOfPax}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="packageType">Package Type *</Label>
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadType">Lead Type *</Label>
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : customer ? 'Update Customer' : 'Add Customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
