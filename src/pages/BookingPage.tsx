import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Car, 
  CreditCard,
  QrCode,
  Check,
  Copy,
  Download
} from 'lucide-react';
import { mockParkingSpots, mockUser } from '../data/mockData';
import { QRCodeGenerator } from '../components/QRCodeGenerator';

export const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<'time' | 'payment' | 'success'>('time');
  const [selectedVehicle, setSelectedVehicle] = useState(mockUser.vehicles[0].id);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingId] = useState('BK' + Date.now());
  const [qrCode] = useState(`${bookingId}-${id}-${Date.now()}`);
  const [pin] = useState(Math.floor(1000 + Math.random() * 9000).toString());
  
  const spot = mockParkingSpots.find(s => s.id === id);

  if (!spot) {
    return <div>Parking spot not found</div>;
  }

  const calculateDuration = () => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(`2024-01-01 ${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
  };

  const calculateTotal = () => {
    const duration = calculateDuration();
    return Math.round(duration * spot.price * 100) / 100;
  };

  const handleBooking = () => {
    if (step === 'time') {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('success');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    alert(`${type} copied to clipboard!`);
  };

  const downloadQR = () => {
    // In a real app, you'd generate and download the QR code image
    alert('QR Code download functionality would be implemented here');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-50 p-6 text-center border-b">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Successful!
            </h2>
            <p className="text-green-700">
              Your parking spot has been reserved
            </p>
          </div>

          <div className="p-6">
            {/* Booking Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{spot.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{spot.address}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{startDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{startTime} - {endTime}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200 mt-2">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-lg">${calculateTotal()}</span>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4 text-center">
              <h4 className="font-semibold text-blue-900 mb-3">Entry QR Code</h4>
              <QRCodeGenerator 
                value={qrCode} 
                size={160}
                className="mb-3"
              />
              <p className="text-sm text-blue-700 mb-3">
                Show this QR code to the parking attendant
              </p>
              <div className="flex gap-2">
                <button
                  onClick={downloadQR}
                  className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Save QR</span>
                </button>
                <button
                  onClick={() => copyToClipboard(qrCode, 'QR Code')}
                  className="flex-1 flex items-center justify-center space-x-1 border border-blue-200 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* PIN Backup */}
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-orange-900">Backup PIN</span>
                </div>
                <button
                  onClick={() => copyToClipboard(pin, 'PIN')}
                  className="p-1 hover:bg-orange-100 rounded transition-colors"
                >
                  <Copy className="h-4 w-4 text-orange-600" />
                </button>
              </div>
              <div className="text-3xl font-bold text-orange-900 text-center mb-2 font-mono tracking-wider">
                {pin}
              </div>
              <p className="text-sm text-orange-700 text-center">
                Use this PIN if QR code doesn't work
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Navigate to Parking
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/bookings')}
                  className="border border-gray-200 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  My Bookings
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="border border-gray-200 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Book More
                </button>
              </div>
            </div>

            {/* Booking ID */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Booking ID: <span className="font-mono">{bookingId}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Progress Indicator */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                step === 'time' ? 'text-blue-600' : 'text-green-600'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === 'time' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {step === 'time' ? '1' : <Check className="h-4 w-4" />}
                </div>
                <span className="text-sm font-medium">Select Time</span>
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className={`flex items-center space-x-2 ${
                step === 'payment' ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Payment</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Parking Spot Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-1">{spot.name}</h3>
              <p className="text-sm text-gray-600">{spot.address}</p>
              <p className="text-sm text-blue-600 font-medium">
                ${spot.price}/{spot.priceType}
              </p>
            </div>

            {step === 'time' && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Select Parking Time
                </h2>

                <div className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Time Selection */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline h-4 w-4 mr-1" />
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Vehicle Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Car className="inline h-4 w-4 mr-1" />
                      Select Vehicle
                    </label>
                    <select
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      {mockUser.vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cost Summary */}
                  {startTime && endTime && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-blue-700">
                            Duration: {calculateDuration().toFixed(1)} hours
                          </p>
                          <p className="text-sm text-blue-700">
                            Rate: ${spot.price}/{spot.priceType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-900">
                            ${calculateTotal()}
                          </p>
                          <p className="text-sm text-blue-700">Total Cost</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 'payment' && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Payment Details
                </h2>

                <div className="space-y-6">
                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="h-5 w-5" /> },
                        { id: 'qr', name: 'QR Payment (PromptPay)', icon: <QrCode className="h-5 w-5" /> },
                        { id: 'wallet', name: 'E-Wallet', icon: <Car className="h-5 w-5" /> }
                      ].map((method) => (
                        <label key={method.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3"
                          />
                          <div className="flex items-center space-x-2">
                            {method.icon}
                            <span>{method.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{startTime} - {endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{calculateDuration().toFixed(1)} hours</span>
                      </div>
                      <div className="flex justify-between font-semibold text-base pt-2 border-t">
                        <span>Total:</span>
                        <span>${calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              {step === 'payment' && (
                <button
                  onClick={() => setStep('time')}
                  className="flex-1 border border-gray-200 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleBooking}
                disabled={
                  (step === 'time' && (!startDate || !startTime || !endTime)) ||
                  (step === 'payment' && !paymentMethod)
                }
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {step === 'time' ? 'Proceed to Payment' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};