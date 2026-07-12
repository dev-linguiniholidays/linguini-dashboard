export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface Passenger {
  name: string;
  gender: 'male' | 'female' | 'other' | '';
  age: number | '';
  aadhaarNo: string;
  contactNo?: string;
  emailId?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  destination: string;
  status: 'fresh' | 'no-response' | 'ongoing' | 'converted' | 'dead' | 'future' | 'hot';
  description: string;
  travelStartDate: string;
  travelEndDate: string;
  leadCreationDate: string;
  numberOfPax: number;
  leadType: 'calling' | 'instagram' | 'referral' | 'website' | 'facebook' | 'walk-in' | 'other' | 'instagram-ad' | 'whatsapp-ad';
  service: 'tour-package' | 'flight' | 'train' | 'visa' | 'group-departure' | 'bus' | 'cab' | 'hotel';
  assignee: string;
  comments: Comment[];
  updatedAt: string;
  isLocked: boolean;
  packageCost: number;
  aadhaarNo?: string;
  passengers?: Passenger[];
  email?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: 'Hotel' | 'Taxi' | 'Bus' | 'Guide' | 'Travel Hamper' | 'Medical Kit' | 'Misc.';
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface Payment {
  id: string;
  amount: number;
  tag: 'Cash' | 'UPI' | 'Card' | 'Net Banking' | 'Other';
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface Booking {
  id: string;
  bookingId?: string;
  name: string;
  phone: string;
  destination: string;
  status: 'upcoming' | 'ongoing' | 'postponed' | 'cancelled' | 'completed';
  description: string;
  travelStartDate: string;
  travelEndDate: string;
  leadCreationDate: string;
  numberOfPax: number;
  leadType: 'calling' | 'instagram' | 'referral' | 'website' | 'facebook' | 'walk-in' | 'other' | 'instagram-ad' | 'whatsapp-ad';
  service: 'tour-package' | 'flight' | 'train' | 'visa' | 'group-departure' | 'bus' | 'cab' | 'hotel';
  assignee: string;
  comments: Comment[];
  updatedAt: string;
  packageCost: number;
  expenses: Expense[];
  payments: Payment[];
  profit: number;
  aadhaarNo?: string;
  passengers?: Passenger[];
  email?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

