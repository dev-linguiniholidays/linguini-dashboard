export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: string;
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
  packageType: 'private' | 'group';
  leadType: 'calling' | 'instagram' | 'referral' | 'website' | 'facebook' | 'walk-in' | 'other';
  service: 'tour-package' | 'flight' | 'train' | 'visa' | 'group-departure' | 'bus' | 'cab' | 'hotel';
  assignee: string;
  comments: Comment[];
  updatedAt: string;
}
