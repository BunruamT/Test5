import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  Car, 
  Heart, 
  Navigation,
  Zap,
  Shield,
  Umbrella,
  ArrowLeft
} from 'lucide-react';
import { mockParkingSpots, mockReviews } from '../data/mockData';

export const ParkingSpotDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const spot = mockParkingSpots.find(s => s.id === id);
  const reviews = mockReviews.filter(r => r.spotId === id);

  if (!spot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Parking spot not found
          </h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number, type: string) => {
    return `$${price}/${type}`;
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'EV Charging': return <Zap className="h-5 w-5 text-green-600" />;
      case 'CCTV Security': return <Shield className="h-5 w-5 text-blue-600" />;
      case 'Covered Parking': return <Umbrella className="h-5 w-5 text-purple-600" />;
      default: return <Car className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to search</span>
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative">
            <img
              src={spot.images[selectedImage]}
              alt={spot.name}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-full font-semibold text-lg">
              {formatPrice(spot.price, spot.priceType)}
            </div>
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {spot.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    selectedImage === index ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {spot.name}
                </h1>
                <div className="flex items-center space-x-1 text-gray-600 mb-2">
                  <MapPin className="h-5 w-5" />
                  <span>{spot.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{spot.rating}</span>
                    <span className="text-gray-500">({spot.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`p-3 rounded-full transition-colors ${
                  isFavorited 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Quick Info */}
            <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span>Hours</span>
                </div>
                <div className="font-semibold">{spot.openingHours}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-1">
                  <Car className="h-4 w-4" />
                  <span>Available</span>
                </div>
                <div className="font-semibold">
                  {spot.availableSlots} / {spot.totalSlots} spots
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-1">
                  <Phone className="h-4 w-4" />
                  <span>Contact</span>
                </div>
                <div className="font-semibold">{spot.phone || 'N/A'}</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About this parking spot
              </h3>
              <p className="text-gray-600">{spot.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Amenities
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {spot.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getAmenityIcon(amenity)}
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Recent Reviews
              </h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                          {review.userName}
                        </span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                to={`/book/${spot.id}`}
                className="flex-1 bg-blue-600 text-white text-center py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Book Now
              </Link>
              <button className="flex items-center justify-center space-x-2 px-6 py-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                <Navigation className="h-5 w-5" />
                <span>Navigate</span>
              </button>
              {spot.phone && (
                <button className="flex items-center justify-center space-x-2 px-6 py-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  <Phone className="h-5 w-5" />
                  <span>Call</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};