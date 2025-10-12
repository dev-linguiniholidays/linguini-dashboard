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
  assignee: 'none' | 'admin' | 'user1' | 'user2' | 'user3' | 'user4';
  comments: Comment[];
  updatedAt: string;
}

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+91 9876543210',
    destination: 'Paris, France',
    status: 'hot',
    description: 'Planning a romantic getaway for anniversary',
    travelStartDate: '2024-02-14',
    travelEndDate: '2024-02-20',
    leadCreationDate: '2024-01-10T10:30:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'instagram',
    service: 'tour-package',
    assignee: 'admin',
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
        userName: 'Admin User',
        timestamp: '2024-01-14T09:15:00Z'
      }
    ],
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+91 9876543211',
    destination: 'Tokyo, Japan',
    status: 'ongoing',
    description: 'Business trip with family extension',
    travelStartDate: '2024-03-15',
    travelEndDate: '2024-03-25',
    leadCreationDate: '2024-01-05T15:45:00Z',
    numberOfPax: 4,
    packageType: 'group',
    leadType: 'calling',
    service: 'flight',
    assignee: 'user1',
    comments: [
      {
        id: 'c3',
        text: 'Customer prefers group tours',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-14T16:20:00Z'
      }
    ],
    updatedAt: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Mike Chen',
    phone: '+91 9876543212',
    destination: 'Bali, Indonesia',
    status: 'converted',
    description: 'Honeymoon trip - completed successfully',
    travelStartDate: '2024-01-20',
    travelEndDate: '2024-01-27',
    leadCreationDate: '2023-12-15T09:20:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'referral',
    service: 'hotel',
    assignee: 'user2',
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
        userName: 'Admin User',
        timestamp: '2024-01-27T18:30:00Z'
      }
    ],
    updatedAt: '2024-01-10T09:20:00Z'
  },
  {
    id: '4',
    name: 'Emily Davis',
    phone: '+91 9876543213',
    destination: 'Rome, Italy',
    status: 'fresh',
    description: 'Cultural tour with art museums focus',
    travelStartDate: '2024-04-10',
    travelEndDate: '2024-04-17',
    leadCreationDate: '2024-01-12T14:15:00Z',
    numberOfPax: 1,
    packageType: 'group',
    leadType: 'website',
    service: 'tour-package',
    assignee: 'user4',
    comments: [],
    updatedAt: '2024-01-12T14:15:00Z'
  },
  {
    id: '5',
    name: 'David Wilson',
    phone: '+91 9876543214',
    destination: 'New York, USA',
    status: 'dead',
    description: 'Cancelled due to work commitments',
    travelStartDate: '2024-02-01',
    travelEndDate: '2024-02-08',
    leadCreationDate: '2023-11-20T11:30:00Z',
    numberOfPax: 3,
    packageType: 'private',
    leadType: 'facebook',
    service: 'train',
    assignee: 'user3',
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
    phone: '+91 9876543215',
    destination: 'Dubai, UAE',
    status: 'hot',
    description: 'Luxury shopping and desert safari',
    travelStartDate: '2024-03-01',
    travelEndDate: '2024-03-08',
    leadCreationDate: '2024-01-08T16:45:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'walk-in',
    service: 'bus',
    assignee: 'admin',
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
    phone: '+91 9876543216',
    destination: 'London, UK',
    status: 'no-response',
    description: 'Business conference attendance',
    travelStartDate: '2024-05-15',
    travelEndDate: '2024-05-22',
    leadCreationDate: '2024-01-11T13:20:00Z',
    numberOfPax: 1,
    packageType: 'group',
    leadType: 'calling',
    service: 'visa',
    assignee: 'user2',
    comments: [
      {
        id: 'c8',
        text: 'No response to follow-up calls',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-12T10:00:00Z'
      }
    ],
    updatedAt: '2024-01-11T13:20:00Z'
  },
  {
    id: '8',
    name: 'Maria Garcia',
    phone: '+91 9876543217',
    destination: 'Barcelona, Spain',
    status: 'future',
    description: 'Food and wine tour',
    travelStartDate: '2024-06-10',
    travelEndDate: '2024-06-17',
    leadCreationDate: '2024-01-09T12:10:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'instagram',
    service: 'tour-package',
    assignee: 'admin',
    comments: [
      {
        id: 'c9',
        text: 'Customer interested in culinary experiences',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-09T12:10:00Z'
      }
    ],
    updatedAt: '2024-01-09T12:10:00Z'
  },
  {
    id: '9',
    name: 'James Anderson',
    phone: '+91 9876543218',
    destination: 'Sydney, Australia',
    status: 'hot',
    description: 'Adventure sports and wildlife tour',
    travelStartDate: '2024-03-20',
    travelEndDate: '2024-04-05',
    leadCreationDate: '2024-01-14T08:30:00Z',
    numberOfPax: 3,
    packageType: 'group',
    leadType: 'website',
    service: 'tour-package',
    assignee: 'user2',
    comments: [
      {
        id: 'c10',
        text: 'Very active customer, interested in extreme sports',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-14T08:30:00Z'
      }
    ],
    updatedAt: '2024-01-14T08:30:00Z'
  },
  {
    id: '10',
    name: 'Jennifer Lee',
    phone: '+91 9876543219',
    destination: 'Cape Town, South Africa',
    status: 'ongoing',
    description: 'Safari and wine tasting experience',
    travelStartDate: '2024-04-15',
    travelEndDate: '2024-04-28',
    leadCreationDate: '2024-01-13T11:45:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'referral',
    service: 'group-departure',
    assignee: 'user2',
    comments: [
      {
        id: 'c11',
        text: 'Referred by Mike Chen - very satisfied customer',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-13T11:45:00Z'
      }
    ],
    updatedAt: '2024-01-13T11:45:00Z'
  },
  {
    id: '11',
    name: 'Michael Rodriguez',
    phone: '+91 9876543220',
    destination: 'Thailand',
    status: 'fresh',
    description: 'Beach vacation and cultural exploration',
    travelStartDate: '2024-05-01',
    travelEndDate: '2024-05-15',
    leadCreationDate: '2024-01-16T14:20:00Z',
    numberOfPax: 4,
    packageType: 'group',
    leadType: 'facebook',
    service: 'cab',
    assignee: 'user1',
    comments: [],
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '12',
    name: 'Amanda White',
    phone: '+91 9876543221',
    destination: 'Switzerland',
    status: 'converted',
    description: 'Skiing holiday - trip completed',
    travelStartDate: '2024-01-05',
    travelEndDate: '2024-01-12',
    leadCreationDate: '2023-12-10T09:15:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'instagram',
    service: 'flight',
    assignee: 'user2',
    comments: [
      {
        id: 'c12',
        text: 'Excellent skiing experience, customer very happy',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-13T16:00:00Z'
      }
    ],
    updatedAt: '2024-01-13T16:00:00Z'
  },
  {
    id: '13',
    name: 'Christopher Kim',
    phone: '+91 9876543222',
    destination: 'Singapore',
    status: 'hot',
    description: 'Business trip with family leisure time',
    travelStartDate: '2024-02-25',
    travelEndDate: '2024-03-05',
    leadCreationDate: '2024-01-15T10:30:00Z',
    numberOfPax: 3,
    packageType: 'private',
    leadType: 'calling',
    service: 'visa',
    assignee: 'none',
    comments: [
      {
        id: 'c13',
        text: 'High budget customer, wants luxury accommodations',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-15T10:30:00Z'
      }
    ],
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '14',
    name: 'Rachel Thompson',
    phone: '+91 9876543223',
    destination: 'Greece',
    status: 'ongoing',
    description: 'Island hopping and historical sites',
    travelStartDate: '2024-06-01',
    travelEndDate: '2024-06-15',
    leadCreationDate: '2024-01-12T16:45:00Z',
    numberOfPax: 2,
    packageType: 'group',
    leadType: 'website',
    service: 'hotel',
    assignee: 'user1',
    comments: [
      {
        id: 'c14',
        text: 'Interested in cultural and historical tours',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-12T16:45:00Z'
      }
    ],
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '15',
    name: 'Daniel Martinez',
    phone: '+91 9876543224',
    destination: 'Morocco',
    status: 'fresh',
    description: 'Desert adventure and cultural immersion',
    travelStartDate: '2024-04-20',
    travelEndDate: '2024-05-02',
    leadCreationDate: '2024-01-17T13:30:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'walk-in',
    service: 'train',
    assignee: 'user3',
    comments: [],
    updatedAt: '2024-01-17T13:30:00Z'
  },
  {
    id: '16',
    name: 'Sophie Williams',
    phone: '+91 9876543225',
    destination: 'Norway',
    status: 'future',
    description: 'Northern lights and fjord cruise',
    travelStartDate: '2024-12-15',
    travelEndDate: '2024-12-25',
    leadCreationDate: '2024-01-11T12:00:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'referral',
    service: 'flight',
    assignee: 'none',
    comments: [
      {
        id: 'c15',
        text: 'Planning far ahead for winter trip',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-11T12:00:00Z'
      }
    ],
    updatedAt: '2024-01-11T12:00:00Z'
  },
  {
    id: '17',
    name: 'Kevin Johnson',
    phone: '+91 9876543226',
    destination: 'India',
    status: 'dead',
    description: 'Cancelled due to visa issues',
    travelStartDate: '2024-03-10',
    travelEndDate: '2024-03-25',
    leadCreationDate: '2023-12-20T14:15:00Z',
    numberOfPax: 2,
    packageType: 'group',
    leadType: 'calling',
    service: 'group-departure',
    assignee: 'user3',
    comments: [
      {
        id: 'c16',
        text: 'Visa application rejected, customer cancelled',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-10T14:15:00Z'
      }
    ],
    updatedAt: '2024-01-10T14:15:00Z'
  },
  {
    id: '18',
    name: 'Nicole Davis',
    phone: '+91 9876543227',
    destination: 'Peru',
    status: 'hot',
    description: 'Machu Picchu trek and cultural tour',
    travelStartDate: '2024-07-15',
    travelEndDate: '2024-07-28',
    leadCreationDate: '2024-01-16T09:45:00Z',
    numberOfPax: 1,
    packageType: 'group',
    leadType: 'instagram',
    service: 'tour-package',
    assignee: 'user4',
    comments: [
      {
        id: 'c17',
        text: 'Adventure seeker, very excited about trekking',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-16T09:45:00Z'
      }
    ],
    updatedAt: '2024-01-16T09:45:00Z'
  },
  {
    id: '19',
    name: 'Alex Thompson',
    phone: '+91 9876543228',
    destination: 'Vietnam',
    status: 'ongoing',
    description: 'Food tour and motorbike adventure',
    travelStartDate: '2024-05-20',
    travelEndDate: '2024-06-05',
    leadCreationDate: '2024-01-14T15:20:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'website',
    service: 'train',
    assignee: 'user2',
    comments: [
      {
        id: 'c18',
        text: 'Food enthusiast, wants authentic local experiences',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-14T15:20:00Z'
      }
    ],
    updatedAt: '2024-01-14T15:20:00Z'
  },
  {
    id: '20',
    name: 'Jessica Brown',
    phone: '+91 9876543229',
    destination: 'Iceland',
    status: 'converted',
    description: 'Aurora borealis tour - completed successfully',
    travelStartDate: '2024-01-08',
    travelEndDate: '2024-01-15',
    leadCreationDate: '2023-12-05T11:30:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'facebook',
    service: 'visa',
    assignee: 'user4',
    comments: [
      {
        id: 'c19',
        text: 'Amazing aurora experience, customer thrilled',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-16T10:00:00Z'
      }
    ],
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: '21',
    name: 'Ryan Wilson',
    phone: '+91 9876543230',
    destination: 'Croatia',
    status: 'fresh',
    description: 'Coastal road trip and island hopping',
    travelStartDate: '2024-08-10',
    travelEndDate: '2024-08-22',
    leadCreationDate: '2024-01-18T10:15:00Z',
    numberOfPax: 3,
    packageType: 'group',
    leadType: 'walk-in',
    service: 'bus',
    assignee: 'admin',
    comments: [],
    updatedAt: '2024-01-18T10:15:00Z'
  },
  {
    id: '22',
    name: 'Megan Taylor',
    phone: '+91 9876543231',
    destination: 'Portugal',
    status: 'no-response',
    description: 'Wine country and coastal cities',
    travelStartDate: '2024-09-05',
    travelEndDate: '2024-09-18',
    leadCreationDate: '2024-01-13T14:30:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'referral',
    service: 'bus',
    assignee: 'user2',
    comments: [
      {
        id: 'c20',
        text: 'No response to emails and calls',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-15T14:30:00Z'
      }
    ],
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '23',
    name: 'Brandon Garcia',
    phone: '+91 9876543232',
    destination: 'Turkey',
    status: 'hot',
    description: 'Historical sites and hot air balloon ride',
    travelStartDate: '2024-04-05',
    travelEndDate: '2024-04-18',
    leadCreationDate: '2024-01-17T11:00:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'instagram',
    service: 'group-departure',
    assignee: 'user3',
    comments: [
      {
        id: 'c21',
        text: 'Very interested in hot air balloon experience',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-17T11:00:00Z'
      }
    ],
    updatedAt: '2024-01-17T11:00:00Z'
  },
  {
    id: '24',
    name: 'Stephanie Lee',
    phone: '+91 9876543233',
    destination: 'New Zealand',
    status: 'ongoing',
    description: 'Lord of the Rings tour and adventure sports',
    travelStartDate: '2024-11-01',
    travelEndDate: '2024-11-20',
    leadCreationDate: '2024-01-15T16:45:00Z',
    numberOfPax: 2,
    packageType: 'group',
    leadType: 'website',
    service: 'hotel',
    assignee: 'user3',
    comments: [
      {
        id: 'c22',
        text: 'Huge LOTR fan, wants comprehensive tour',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-15T16:45:00Z'
      }
    ],
    updatedAt: '2024-01-15T16:45:00Z'
  },
  {
    id: '25',
    name: 'Tyler Anderson',
    phone: '+91 9876543234',
    destination: 'Brazil',
    status: 'fresh',
    description: 'Carnival experience and Amazon rainforest',
    travelStartDate: '2024-02-20',
    travelEndDate: '2024-03-05',
    leadCreationDate: '2024-01-19T13:20:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'calling',
    service: 'train',
    assignee: 'admin',
    comments: [],
    updatedAt: '2024-01-19T13:20:00Z'
  },
  {
    id: '26',
    name: 'Ashley Rodriguez',
    phone: '+91 9876543235',
    destination: 'Egypt',
    status: 'future',
    description: 'Pyramids and Nile cruise',
    travelStartDate: '2024-10-15',
    travelEndDate: '2024-10-28',
    leadCreationDate: '2024-01-12T12:30:00Z',
    numberOfPax: 4,
    packageType: 'group',
    leadType: 'facebook',
    service: 'flight',
    assignee: 'user4',
    comments: [
      {
        id: 'c23',
        text: 'Family trip, wants educational experience for kids',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-12T12:30:00Z'
      }
    ],
    updatedAt: '2024-01-12T12:30:00Z'
  },
  {
    id: '27',
    name: 'Jordan White',
    phone: '+91 9876543236',
    destination: 'South Korea',
    status: 'converted',
    description: 'K-pop culture tour - completed',
    travelStartDate: '2024-01-12',
    travelEndDate: '2024-01-19',
    leadCreationDate: '2023-12-08T15:45:00Z',
    numberOfPax: 1,
    packageType: 'private',
    leadType: 'instagram',
    service: 'hotel',
    assignee: 'user3',
    comments: [
      {
        id: 'c24',
        text: 'Amazing K-pop experience, customer very happy',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-20T09:00:00Z'
      }
    ],
    updatedAt: '2024-01-20T09:00:00Z'
  },
  {
    id: '28',
    name: 'Samantha Kim',
    phone: '+91 9876543237',
    destination: 'Chile',
    status: 'hot',
    description: 'Atacama Desert and Patagonia trek',
    travelStartDate: '2024-06-20',
    travelEndDate: '2024-07-10',
    leadCreationDate: '2024-01-18T14:15:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'referral',
    service: 'visa',
    assignee: 'user2',
    comments: [
      {
        id: 'c25',
        text: 'Adventure enthusiast, very high budget',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-18T14:15:00Z'
      }
    ],
    updatedAt: '2024-01-18T14:15:00Z'
  },
  {
    id: '29',
    name: 'Marcus Thompson',
    phone: '+91 9876543238',
    destination: 'Kenya',
    status: 'ongoing',
    description: 'Safari and Maasai cultural experience',
    travelStartDate: '2024-08-15',
    travelEndDate: '2024-08-28',
    leadCreationDate: '2024-01-16T11:30:00Z',
    numberOfPax: 2,
    packageType: 'group',
    leadType: 'website',
    service: 'flight',
    assignee: 'user2',
    comments: [
      {
        id: 'c26',
        text: 'Wildlife photography enthusiast',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-16T11:30:00Z'
      }
    ],
    updatedAt: '2024-01-16T11:30:00Z'
  },
  {
    id: '30',
    name: 'Lauren Davis',
    phone: '+91 9876543239',
    destination: 'Scotland',
    status: 'fresh',
    description: 'Highlands tour and whisky tasting',
    travelStartDate: '2024-09-20',
    travelEndDate: '2024-10-02',
    leadCreationDate: '2024-01-19T16:00:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'walk-in',
    service: 'group-departure',
    assignee: 'user3',
    comments: [],
    updatedAt: '2024-01-19T16:00:00Z'
  },
  {
    id: '31',
    name: 'Nathan Wilson',
    phone: '+91 9876543240',
    destination: 'Malaysia',
    status: 'dead',
    description: 'Cancelled due to budget constraints',
    travelStartDate: '2024-03-15',
    travelEndDate: '2024-03-28',
    leadCreationDate: '2023-12-25T10:20:00Z',
    numberOfPax: 3,
    packageType: 'group',
    leadType: 'calling',
    service: 'tour-package',
    assignee: 'user2',
    comments: [
      {
        id: 'c27',
        text: 'Budget exceeded, customer cancelled',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-05T10:20:00Z'
      }
    ],
    updatedAt: '2024-01-05T10:20:00Z'
  },
  {
    id: '32',
    name: 'Hannah Johnson',
    phone: '+91 9876543241',
    destination: 'Finland',
    status: 'future',
    description: 'Santa Claus Village and Northern Lights',
    travelStartDate: '2024-12-01',
    travelEndDate: '2024-12-08',
    leadCreationDate: '2024-01-14T13:45:00Z',
    numberOfPax: 4,
    packageType: 'group',
    leadType: 'facebook',
    service: 'cab',
    assignee: 'user2',
    comments: [
      {
        id: 'c28',
        text: 'Family with young children, Christmas trip',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-14T13:45:00Z'
      }
    ],
    updatedAt: '2024-01-14T13:45:00Z'
  },
  {
    id: '33',
    name: 'Cameron Brown',
    phone: '+91 9876543242',
    destination: 'Jordan',
    status: 'hot',
    description: 'Petra and Wadi Rum desert adventure',
    travelStartDate: '2024-05-10',
    travelEndDate: '2024-05-22',
    leadCreationDate: '2024-01-17T15:30:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'instagram',
    service: 'hotel',
    assignee: 'user4',
    comments: [
      {
        id: 'c29',
        text: 'Archaeology enthusiast, very excited about Petra',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-01-17T15:30:00Z'
      }
    ],
    updatedAt: '2024-01-17T15:30:00Z'
  },
  {
    id: '34',
    name: 'Olivia Martinez',
    phone: '+91 9876543243',
    destination: 'Slovenia',
    status: 'ongoing',
    description: 'Lake Bled and Julian Alps hiking',
    travelStartDate: '2024-07-01',
    travelEndDate: '2024-07-12',
    leadCreationDate: '2024-01-15T12:15:00Z',
    numberOfPax: 1,
    packageType: 'group',
    leadType: 'website',
    service: 'hotel',
    assignee: 'user4',
    comments: [
      {
        id: 'c30',
        text: 'Solo traveler, interested in hiking and nature',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: '2024-01-15T12:15:00Z'
      }
    ],
    updatedAt: '2024-01-15T12:15:00Z'
  },
  {
    id: '35',
    name: 'Ethan Taylor',
    phone: '+91 9876543244',
    destination: 'Maldives',
    status: 'converted',
    description: 'Luxury resort and diving - completed',
    travelStartDate: '2024-01-25',
    travelEndDate: '2024-02-01',
    leadCreationDate: '2023-12-12T14:00:00Z',
    numberOfPax: 2,
    packageType: 'private',
    leadType: 'referral',
    service: 'flight',
    assignee: 'user4',
    comments: [
      {
        id: 'c31',
        text: 'Perfect honeymoon destination, customer thrilled',
        userId: 'admin',
        userName: 'Admin User',
        timestamp: '2024-02-02T11:00:00Z'
      }
    ],
    updatedAt: '2024-02-02T11:00:00Z'
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

export const serviceOptions = [
  { value: 'tour-package', label: 'Tour Package' },
  { value: 'flight', label: 'Flight' },
  { value: 'train', label: 'Train' },
  { value: 'visa', label: 'Visa' },
  { value: 'group-departure', label: 'Group Departure' },
  { value: 'bus', label: 'Bus' },
  { value: 'cab', label: 'Cab' },
  { value: 'hotel', label: 'Hotel' }
];

export const assigneeOptions = [
  { value: 'none', label: 'None' },
  { value: 'admin', label: 'Admin User' },
  { value: 'user1', label: 'John Doe' },
  { value: 'user2', label: 'Jane Smith' },
  { value: 'user3', label: 'Mike Johnson' },
  { value: 'user4', label: 'Sarah Wilson' }
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
  'Cape Town, South Africa',
  'Thailand',
  'Switzerland',
  'Singapore',
  'Greece',
  'Morocco',
  'Norway',
  'India',
  'Peru',
  'Vietnam',
  'Iceland',
  'Croatia',
  'Portugal',
  'Turkey',
  'New Zealand',
  'Brazil',
  'Egypt',
  'South Korea',
  'Chile',
  'Kenya',
  'Scotland',
  'Malaysia',
  'Finland',
  'Jordan',
  'Slovenia',
  'Maldives'
];