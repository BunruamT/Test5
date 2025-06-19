import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  Car, 
  Star,
  Navigation,
  MoreHorizontal,
  AlertCircle,
  Copy,
  Download,
  Plus,
  Minus,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { mockBookings, mockParkingSpots } from '../data/mockData';
import { QRCodeGenerator } from '../components/QRCodeGenerator';
import { RatingReviewModal } from '../components/RatingReviewModal';

export const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [showQRModal, setShowQRModal] = useState<string | null>(null);
  const [showExtendModal, setShowExtendModal] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const [extendHours, setExtendHours] = useState(1);
  
  const currentBookings = mockBookings.filter(b => 
    b.status === 'pending' || b.status === 'active'
  );
  const pastBookings = mockBookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled'
  );

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    alert(`${type} copied to clipboard!`);
  };

  const handleExtendBooking = (bookingId: string) => {
    console.log(`Extending booking ${bookingId} by ${extendHours} hours`);
    alert(`Booking extended by ${extendHours} hour(s) successfully!`);
    setShowExtendModal(null);
    setExtendHours(1);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      console.log(`Cancelling booking ${bookingId}`);
      alert('Booking cancelled successfully!');
    }
  };

  const handleSubmitReview = async (rating: number, review: string, photos: string[]) => {
    const booking = mockBookings.find(b => b.id === showReviewModal);
    const spot = mockParkingSpots.find(s => s.id === booking?.spotId);
    
    console.log('Submitting review:', {
      bookingId: showReviewModal,
      spotId: booking?.spotId,
      spotName: spot?.name,
      rating,
      review,
      photos,
      timestamp: new Date().toISOString()
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(`Thank you for your ${rating}-star review of ${spot?.name}!`);
    setShowReviewModal(null);
  };

  const BookingCard: React.FC<{ booking: any; showActions?: boolean }> = ({ 
    booking, 
    showActions = false 
  }) => {
    const spot = mockParkingSpots.find(s => s.id === booking.spotId);
    const startDateTime = formatDateTime(booking.startTime);
    const endDateTime = formatDateTime(booking.endTime);

    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {spot?.name}
            </h3>
            <div className="flex items-center space-x-1 text-gray-600 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{spot?.address}</span>
            </div>
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              getBookingStatusColor(booking.status)
            }`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ${booking.totalCost}
            </div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{startDateTime.date}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{startDateTime.time} - {endDateTime.time}</span>
          </div>
        </div>

        {(booking.status === 'active' || booking.status === 'pending') && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-blue-900 font-semibold">
                <QrCode className="h-5 w-5" />
                <span>Entry Access</span>
              </div>
              <button
                onClick={() => setShowQRModal(booking.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Show QR
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xs text-gray-600 mb-1">PIN Code</div>
                <div className="font-mono text-lg font-bold text-blue-900">{booking.pin}</div>
                <button
                  onClick={() => copyToClipboard(booking.pin, 'PIN')}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  Copy PIN
                </button>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xs text-gray-600 mb-1">QR Code</div>
                <div className="text-sm font-medium text-blue-900">Available</div>
                <button
                  onClick={() => copyToClipboard(booking.qrCode, 'QR Code')}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        )}

        {showActions && (
          <div className="flex flex-wrap gap-2">
            {booking.status === 'active' && (
              <>
                <button className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  <Navigation className="h-4 w-4" />
                  <span>Navigate</span>
                </button>
                <button
                  onClick={() => setShowExtendModal(booking.id)}
                  className="flex items-center space-x-1 border border-green-200 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  <Clock className="h-4 w-4" />
                  <span>Extend Time</span>
                </button>
                <button
                  onClick={() => setShowQRModal(booking.id)}
                  className="flex items-center space-x-1 border border-blue-200 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Show QR</span>
                </button>
              </>
            )}
            {booking.status === 'pending' && (
              <>
                <button
                  onClick={() => setShowQRModal(booking.id)}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Show QR</span>
                </button>
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="flex items-center space-x-1 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </>
            )}
            {booking.status === 'completed' && (
              <>
                <Link
                  to={`/book/${booking.spotId}`}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Car className="h-4 w-4" />
                  <span>Book Again</span>
                </Link>
                <button 
                  onClick={() => setShowReviewModal(booking.id)}
                  className="flex items-center space-x-1 border border-yellow-200 text-yellow-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-colors"
                >
                  <Star className="h-4 w-4" />
                  <span>Rate & Review</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600">
            Manage your parking reservations and history
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'current'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Current & Upcoming ({currentBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              History ({pastBookings.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'current' ? (
            currentBookings.length > 0 ? (
              currentBookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  showActions={true} 
                />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Current Bookings
                </h3>
                <p className="text-gray-600 mb-4">
                  You don't have any active or upcoming reservations.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Car className="h-5 w-5" />
                  <span>Find Parking</span>
                </Link>
              </div>
            )
          ) : (
            pastBookings.length > 0 ? (
              pastBookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  showActions={true} 
                />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Booking History
                </h3>
                <p className="text-gray-600">
                  Your completed bookings will appear here.
                </p>
              </div>
            )
          )}
        </div>

        {/* QR Code Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Entry QR Code</h3>
                  <button
                    onClick={() => setShowQRModal(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="text-center">
                  <QRCodeGenerator 
                    value={mockBookings.find(b => b.id === showQRModal)?.qrCode || ''} 
                    size={200}
                    className="mb-4"
                  />
                  
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="text-sm text-blue-700 mb-2">Backup PIN Code</div>
                    <div className="text-3xl font-bold font-mono text-blue-900 mb-2">
                      {mockBookings.find(b => b.id === showQRModal)?.pin}
                    </div>
                    <div className="text-xs text-blue-600">Use if QR scanner doesn't work</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(mockBookings.find(b => b.id === showQRModal)?.qrCode || '', 'QR Code')}
                      className="flex-1 flex items-center justify-center space-x-1 border border-blue-200 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Code</span>
                    </button>
                    <button
                      onClick={() => alert('QR Code download functionality would be implemented here')}
                      className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Save QR</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Extend Time Modal */}
        {showExtendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Extend Parking Time</h3>
                  <button
                    onClick={() => setShowExtendModal(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-600 mb-1">Current booking ends at:</div>
                    <div className="font-semibold text-gray-900">
                      {formatDateTime(mockBookings.find(b => b.id === showExtendModal)?.endTime || '').time}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extend by how many hours?
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setExtendHours(Math.max(1, extendHours - 1))}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-gray-900">{extendHours}</div>
                        <div className="text-sm text-gray-600">hour{extendHours !== 1 ? 's' : ''}</div>
                      </div>
                      <button
                        onClick={() => setExtendHours(extendHours + 1)}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-green-700">Extension Cost</div>
                        <div className="text-sm text-green-600">
                          {extendHours} hour{extendHours !== 1 ? 's' : ''} × $25/hour
                        </div>
                      </div>
                      <div className="text-xl font-bold text-green-900">
                        ${extendHours * 25}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExtendModal(null)}
                    className="flex-1 border border-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleExtendBooking(showExtendModal)}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Extend Parking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rating & Review Modal */}
        <RatingReviewModal
          isOpen={showReviewModal !== null}
          onClose={() => setShowReviewModal(null)}
          spotName={mockParkingSpots.find(s => s.id === mockBookings.find(b => b.id === showReviewModal)?.spotId)?.name || ''}
          bookingId={showReviewModal || ''}
          onSubmit={handleSubmitReview}
        />
      </div>
    </div>
  );
};