import React, { useState } from 'react';
import { Star, X, Send, Camera, Plus } from 'lucide-react';

interface RatingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  spotName: string;
  bookingId: string;
  onSubmit: (rating: number, review: string, photos: string[]) => void;
}

export const RatingReviewModal: React.FC<RatingReviewModalProps> = ({
  isOpen,
  onClose,
  spotName,
  bookingId,
  onSubmit
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, review, photos);
      // Reset form
      setRating(0);
      setHoverRating(0);
      setReview('');
      setPhotos([]);
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPhoto = () => {
    const url = prompt('Enter photo URL:');
    if (url) {
      setPhotos(prev => [...prev, url]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const ratingLabels = [
    '', // 0 stars
    'Terrible',
    'Poor', 
    'Average',
    'Good',
    'Excellent'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Rate & Review</h3>
              <p className="text-sm text-gray-600">{spotName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How was your parking experience?
              </label>
              <div className="flex items-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {(rating > 0 || hoverRating > 0) && (
                <p className="text-sm font-medium text-gray-700">
                  {ratingLabels[hoverRating || rating]}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write your review (optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                placeholder="Share your experience with other drivers. Was the location easy to find? How was the security? Any tips for future visitors?"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  Help other drivers by sharing specific details
                </p>
                <p className="text-xs text-gray-500">
                  {review.length}/500
                </p>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add photos (optional)
              </label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {photos.length < 3 && (
                  <button
                    type="button"
                    onClick={addPhoto}
                    className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <div className="text-center">
                      <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">Add Photo</span>
                    </div>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Add up to 3 photos to help other drivers
              </p>
            </div>

            {/* Review Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rate specific aspects (optional)
              </label>
              <div className="space-y-3">
                {[
                  { label: 'Location & Access', key: 'location' },
                  { label: 'Security & Safety', key: 'security' },
                  { label: 'Value for Money', key: 'value' },
                  { label: 'Cleanliness', key: 'cleanliness' }
                ].map((aspect) => (
                  <div key={aspect.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{aspect.label}</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                Post this review anonymously
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Review Guidelines */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Review Guidelines</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Be honest and helpful to other drivers</li>
              <li>• Focus on your parking experience</li>
              <li>• Avoid personal information or offensive content</li>
              <li>• Photos should be relevant to the parking spot</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};