import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, Hash, Check, X, AlertCircle } from 'lucide-react';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [scanMode, setScanMode] = useState<'qr' | 'pin'>('qr');
  const [pinInput, setPinInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (scanMode === 'qr' && videoRef.current) {
      startQRScanner();
    }

    return () => {
      stopQRScanner();
    };
  }, [scanMode]);

  const startQRScanner = async () => {
    if (!videoRef.current) return;

    try {
      setIsScanning(true);
      setError(null);

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
          stopQRScanner();
        },
        {
          onDecodeError: (error) => {
            console.log('QR decode error:', error);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScannerRef.current.start();
    } catch (error) {
      console.error('QR Scanner error:', error);
      setError('Failed to start camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopQRScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length === 4) {
      onScan(pinInput);
      setPinInput('');
    }
  };

  const handleModeChange = (mode: 'qr' | 'pin') => {
    stopQRScanner();
    setScanMode(mode);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Entry Validation</h3>
            {onClose && (
              <button
                onClick={() => {
                  stopQRScanner();
                  onClose();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => handleModeChange('qr')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
                scanMode === 'qr'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <QrCode className="h-4 w-4" />
              <span>QR Code</span>
            </button>
            <button
              onClick={() => handleModeChange('pin')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
                scanMode === 'pin'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <Hash className="h-4 w-4" />
              <span>PIN</span>
            </button>
          </div>

          {scanMode === 'qr' ? (
            <div className="text-center">
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                {!isScanning && !error && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                      <p className="text-red-600 text-sm">{error}</p>
                      <button
                        onClick={startQRScanner}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Position the QR code within the camera view
              </p>
            </div>
          ) : (
            <form onSubmit={handlePinSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 4-digit PIN
                </label>
                <input
                  type="text"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="1234"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  maxLength={4}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={pinInput.length !== 4}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Validate PIN
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};