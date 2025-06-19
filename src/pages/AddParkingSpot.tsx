import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Camera, 
  Plus, 
  X,
  Car,
  Zap,
  Shield,
  Umbrella,
  Wifi,
  Coffee,
  Wrench
} from 'lucide-react';

export const AddParkingSpot: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    lat: 0,
    lng: 0,
    totalSlots: 1,
    priceType: 'hour' as 'hour' | 'day' | 'month',
    price: 0,
    phone: '',
    amenities: [] as string[],
    images: [] as string[],
    operatingHours: {
      monday: { open: '00:00', close: '23:59', closed: false },
      tuesday: { open: '00:00', close: '23:59', closed: false },
      wednesday: { open: '00:00', close: '23:59', closed: false },
      thursday: { open: '00:00', close: '23:59', closed: false },
      friday: { open: '00:00', close: '23:59', closed: false },
      saturday: { open: '00:00', close: '23:59', closed: false },
      sunday: { open: '00:00', close: '23:59', closed: false },
    },
    features: {
      allowExtensions: true,
      requireQREntry: true,
      plateRestriction: false,
      valetService: false,
      carWash: false,
    }
  });

  const availableAmenities = [
    { id: 'ev-charging', name: 'EV Charging', icon: Zap },
    { id: 'cctv', name: 'CCTV Security', icon: Shield },
    { id: 'covered', name: 'Covered Parking', icon: Umbrella },
    { id: 'wifi', name: 'Free WiFi', icon: Wifi },
    { id: 'cafe', name: 'Cafe Nearby', icon: Coffee },
    { id: 'maintenance', name: 'Car Maintenance', icon: Wrench },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    const amenity = availableAmenities.find(a => a.id === amenityId);
    if (!amenity) return;

    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity.name)
        ? prev.amenities.filter(a => a !== amenity.name)
        : [...prev.amenities, amenity.name]
    }));
  };

  const handleOperatingHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day as keyof typeof prev.operatingHours],
          [field]: value
        }
      }
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature as keyof typeof prev.features]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating parking spot:', formData);
    // In a real app, this would save to the database
    alert('Parking spot created successfully!');
    navigate('/admin');
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Add New Parking Spot
            </h1>
            <p className="text-gray-600">
              Fill in the details to create a new parking spot listing
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Spot Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Central Plaza Parking"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe your parking spot, its features, and any important information..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, Downtown, City, State"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 mb-2">📍 Map Location Picker</p>
                <p className="text-xs text-blue-600">In a real application, this would integrate with Google Maps API for precise location selection.</p>
              </div>
            </div>

            {/* Pricing & Capacity */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing & Capacity
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="25.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Type *
                  </label>
                  <select
                    name="priceType"
                    value={formData.priceType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                    <option value="month">Per Month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Parking Slots *
                  </label>
                  <input
                    type="number"
                    name="totalSlots"
                    value={formData.totalSlots}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="50"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Operating Hours
              </h3>
              <div className="space-y-4">
                {Object.entries(formData.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-24">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {day}
                      </span>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!hours.closed}
                        onChange={(e) => handleOperatingHoursChange(day, 'closed', !e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-600">Open</span>
                    </label>
                    {!hours.closed && (
                      <>
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </>
                    )}
                    {hours.closed && (
                      <span className="text-red-600 text-sm">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableAmenities.map((amenity) => {
                  const Icon = amenity.icon;
                  const isSelected = formData.amenities.includes(amenity.name);
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{amenity.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Images */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Images
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Parking spot ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <div className="text-center">
                    <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Add Image</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & Settings</h3>
              <div className="space-y-4">
                {Object.entries(formData.features).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {key === 'allowExtensions' && 'Allow Time Extensions'}
                        {key === 'requireQREntry' && 'Require QR Code Entry'}
                        {key === 'plateRestriction' && 'License Plate Restriction'}
                        {key === 'valetService' && 'Valet Service Available'}
                        {key === 'carWash' && 'Car Wash Service'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {key === 'allowExtensions' && 'Users can extend their parking time'}
                        {key === 'requireQREntry' && 'Entry requires QR code or PIN validation'}
                        {key === 'plateRestriction' && 'Restrict access to registered license plates only'}
                        {key === 'valetService' && 'Professional valet parking service'}
                        {key === 'carWash' && 'On-site car washing services'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleFeatureToggle(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="flex-1 border border-gray-200 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Parking Spot
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};