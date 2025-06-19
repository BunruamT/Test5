import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle, Camera } from 'lucide-react';
import { supabase, uploadFile, getPublicUrl } from '../lib/supabase';

interface PaymentSlipUploadProps {
  bookingId: string;
  onUploadComplete: (imageUrl: string) => void;
  onClose: () => void;
}

export const PaymentSlipUpload: React.FC<PaymentSlipUploadProps> = ({
  bookingId,
  onUploadComplete,
  onClose
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload to Supabase Storage
      const fileName = `payment-slip-${bookingId}-${Date.now()}.${file.name.split('.').pop()}`;
      const filePath = `payment-slips/${fileName}`;
      
      await uploadFile('payment-slips', filePath, file);
      const imageUrl = getPublicUrl('payment-slips', filePath);

      // Save payment slip record
      const { error: dbError } = await supabase
        .from('payment_slips')
        .insert({
          booking_id: bookingId,
          image_url: imageUrl,
          status: 'pending'
        });

      if (dbError) throw dbError;

      onUploadComplete(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload payment slip. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Upload Payment Slip</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            {uploading ? (
              <div className="space-y-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600">Uploading payment slip...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Upload Payment Slip
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop your payment slip image here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Choose File</span>
                  </label>
                </div>
                <div className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF (Max 5MB)
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Payment Instructions</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Take a clear photo of your payment receipt</li>
              <li>• Ensure all transaction details are visible</li>
              <li>• Include the booking reference if available</li>
              <li>• Your booking will be confirmed after verification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};