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
  comments: Comment[];
  updatedAt: string;
}

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1-555-0123',
    destination: 'Paris, France',
    status: 'hot',
    description: 'Planning a romantic getaway for anniversary',
    travelStartDate: '2024-02-14',
    travelEndDate: '2024-02-20',
    leadCreationDate: '2024-01-10T10:30:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'instagram',
    comments: [
      {
        id: 'c1',
        text: 'Customer is very interested in luxury accommodations',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-15T14:30:00Z'
      },
      {
        id: 'c2',
        text: 'Follow up call scheduled for tomorrow',
        userId: 'user1',
        userName: 'Regular User',
        timestamp: '2024-01-14T09:15:00Z'
      }
    ],
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+1-555-0124',
    destination: 'Tokyo, Japan',
    status: 'ongoing',
    description: 'Business trip with family extension',
    travelStartDate: '2024-03-15',
    travelEndDate: '2024-03-25',
    leadCreationDate: '2024-01-05T15:45:00Z',
    numberOfPax: 4,
    packageType: 'group',
    leadType: 'calling',
    comments: [
      {
        id: 'c3',
        text: 'Customer prefers group tours',
        userId: 'user1',
        userName: 'Regular User',
        timestamp: '2024-01-14T16:20:00Z'
      }
    ],
    updatedAt: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Mike Chen',
    phone: '+1-555-0125',
    destination: 'Bali, Indonesia',
    status: 'converted',
    description: 'Honeymoon trip - completed successfully',
    travelStartDate: '2024-01-20',
    travelEndDate: '2024-01-27',
    leadCreationDate: '2023-12-15T09:20:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'referral',
    comments: [
      {
        id: 'c4',
        text: 'Trip completed successfully, customer very satisfied',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-28T10:00:00Z'
      },
      {
        id: 'c5',
        text: 'Customer recommended us to friends',
        userId: 'user1',
        userName: 'Regular User',
        timestamp: '2024-01-27T18:30:00Z'
      }
    ],
    updatedAt: '2024-01-10T09:20:00Z'
  },
  {
    id: '4',
    name: 'Emily Davis',
    phone: '+1-555-0126',
    destination: 'Rome, Italy',
    status: 'fresh',
    description: 'Cultural tour with art museums focus',
    travelStartDate: '2024-04-10',
    travelEndDate: '2024-04-17',
    leadCreationDate: '2024-01-12T14:15:00Z',
    numberOfPax: 1,
    packageType: 'group',
    leadType: 'website',
    comments: [],
    updatedAt: '2024-01-12T14:15:00Z'
  },
  {
    id: '5',
    name: 'David Wilson',
    phone: '+1-555-0127',
    destination: 'New York, USA',
    status: 'dead',
    description: 'Cancelled due to work commitments',
    travelStartDate: '2024-02-01',
    travelEndDate: '2024-02-08',
    leadCreationDate: '2023-11-20T11:30:00Z',
    numberOfPax: 3,
    packageType: 'private',
    leadType: 'facebook',
    comments: [
      {
        id: 'c6',
        text: 'Customer cancelled due to work emergency',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-08T11:30:00Z'
      }
    ],
    updatedAt: '2024-01-08T11:30:00Z'
  },
  {
    id: '6',
    name: 'Lisa Brown',
    phone: '+1-555-0128',
    destination: 'Dubai, UAE',
    status: 'hot',
    description: 'Luxury shopping and desert safari',
    travelStartDate: '2024-03-01',
    travelEndDate: '2024-03-08',
    leadCreationDate: '2024-01-08T16:45:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'walk-in',
    comments: [
      {
        id: 'c7',
        text: 'High-value customer, interested in premium packages',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-13T16:45:00Z'
      }
    ],
    updatedAt: '2024-01-13T16:45:00Z'
  },
  {
    id: '7',
    name: 'Robert Taylor',
    phone: '+1-555-0129',
    destination: 'London, UK',
    status: 'no-response',
    description: 'Business conference attendance',
    travelStartDate: '2024-05-15',
    travelEndDate: '2024-05-22',
    leadCreationDate: '2024-01-11T13:20:00Z',
    numberOfPax: 1,
    packageType: 'group',
    leadType: 'calling',
    comments: [
      {
        id: 'c8',
        text: 'No response to follow-up calls',
        userId: 'user1',
        userName: 'Regular User',
        timestamp: '2024-01-12T10:00:00Z'
      }
    ],
    updatedAt: '2024-01-11T13:20:00Z'
  },
  {
    id: '8',
    name: 'Maria Garcia',
    phone: '+1-555-0130',
    destination: 'Barcelona, Spain',
    status: 'future',
    description: 'Food and wine tour',
    travelStartDate: '2024-06-10',
    travelEndDate: '2024-06-17',
    leadCreationDate: '2024-01-09T12:10:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'instagram',
    comments: [
      {
        id: 'c9',
        text: 'Customer interested in culinary experiences',
        userId: 'user1',
        userName: 'Regular User',
        timestamp: '2024-01-09T12:10:00Z'
      }
    ],
    updatedAt: '2024-01-09T12:10:00Z'
  }
];

export const statusOptions = [
  { value: 'fresh', label: 'Fresh' },
  { value: 'no-response', label: 'No Response' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'converted', label: 'Converted' },
  { value: 'dead', label: 'Dead' },
  { value: 'future', label: 'Future' },
  { value: 'hot', label: 'Hot' }
];

export const packageTypeOptions = [
  { value: 'private', label: 'Private' },
  { value: 'group', label: 'Group' }
];

export const leadTypeOptions = [
  { value: 'calling', label: 'Calling' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'walk-in', label: 'Walk-in' },
  { value: 'other', label: 'Other' }
];

export const destinationOptions = [
  'Paris, France',
  'Tokyo, Japan',
  'Bali, Indonesia',
  'Rome, Italy',
  'New York, USA',
  'Dubai, UAE',
  'London, UK',
  'Barcelona, Spain',
  'Sydney, Australia',
  'Cape Town, South Africa'
];