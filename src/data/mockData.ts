import { ParkingSpot, Booking, User, Review } from '../types';

export const mockParkingSpots: ParkingSpot[] = [
  {
    id: '1',
    name: 'Central Plaza Parking',
    address: '123 Main Street, Downtown',
    price: 25,
    priceType: 'hour',
    totalSlots: 50,
    availableSlots: 12,
    rating: 4.5,
    reviewCount: 128,
    images: [
      'https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['CCTV Security', 'EV Charging', 'Covered Parking', 'Elevator Access'],
    openingHours: '24/7',
    phone: '+1 (555) 123-4567',
    description: 'Premium parking facility in the heart of downtown with state-of-the-art security and amenities.',
    lat: 40.7589,
    lng: -73.9851,
    ownerId: 'owner1'
  },
  {
    id: '2',
    name: 'Riverside Mall Parking',
    address: '456 River Road, Westside',
    price: 150,
    priceType: 'day',
    totalSlots: 200,
    availableSlots: 45,
    rating: 4.2,
    reviewCount: 89,
    images: [
      'https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['Shopping Access', 'Food Court Nearby', 'Valet Service', 'Car Wash'],
    openingHours: '6:00 AM - 11:00 PM',
    phone: '+1 (555) 987-6543',
    description: 'Convenient mall parking with direct access to shopping and dining.',
    lat: 40.7505,
    lng: -73.9934,
    ownerId: 'owner2'
  },
  {
    id: '3',
    name: 'Airport Express Parking',
    address: '789 Airport Way, Terminal District',
    price: 300,
    priceType: 'day',
    totalSlots: 800,
    availableSlots: 156,
    rating: 4.7,
    reviewCount: 342,
    images: [
      'https://images.pexels.com/photos/2425567/pexels-photo-2425567.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['Shuttle Service', 'Long-term Storage', 'Car Detailing', 'Luggage Assistance'],
    openingHours: '24/7',
    phone: '+1 (555) 456-7890',
    description: 'Premium airport parking with complimentary shuttle service and full-service amenities.',
    lat: 40.6413,
    lng: -73.7781,
    ownerId: 'owner1'
  }
];

export const mockUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  vehicles: [
    {
      id: 'v1',
      make: 'Toyota',
      model: 'Camry',
      licensePlate: 'ABC-123',
      color: 'Silver'
    },
    {
      id: 'v2',
      make: 'Honda',
      model: 'Civic',
      licensePlate: 'XYZ-789',
      color: 'Blue'
    }
  ]
};

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    spotId: '1',
    userId: 'user1',
    startTime: '2024-01-15T09:00:00Z',
    endTime: '2024-01-15T17:00:00Z',
    vehicleId: 'v1',
    totalCost: 200,
    status: 'active',
    qrCode: 'QR123456789',
    pin: '1234',
    createdAt: '2024-01-14T10:30:00Z'
  },
  {
    id: 'b2',
    spotId: '2',
    userId: 'user1',
    startTime: '2024-01-12T14:00:00Z',
    endTime: '2024-01-12T18:00:00Z',
    vehicleId: 'v2',
    totalCost: 100,
    status: 'completed',
    qrCode: 'QR987654321',
    pin: '5678',
    createdAt: '2024-01-11T16:20:00Z'
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    userId: 'user1',
    spotId: '1',
    rating: 5,
    comment: 'Excellent parking facility with great security and easy access. Highly recommended!',
    createdAt: '2024-01-10T15:30:00Z',
    userName: 'John D.'
  },
  {
    id: 'r2',
    userId: 'user2',
    spotId: '1',
    rating: 4,
    comment: 'Good location and clean facilities. The EV charging station was very convenient.',
    createdAt: '2024-01-08T11:45:00Z',
    userName: 'Sarah M.'
  }
];