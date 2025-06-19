export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  price: number;
  priceType: 'hour' | 'day' | 'month';
  totalSlots: number;
  availableSlots: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  openingHours: string;
  phone?: string;
  description: string;
  lat: number;
  lng: number;
  ownerId: string;
}

export interface Booking {
  id: string;
  spotId: string;
  userId: string;
  startTime: string;
  endTime: string;
  vehicleId: string;
  totalCost: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  qrCode: string;
  pin: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicles: Vehicle[];
}

export interface Review {
  id: string;
  userId: string;
  spotId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}