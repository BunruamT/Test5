import React, { useState } from 'react';
import { QrCode, Camera, Hash, Check, X, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [scanMode, setScanMode] = useState<'qr' | 'pin'>('qr');
  const [pinInput, setPinInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length === 4) {
      onScan(pinInput);
      setPinInput('');
    }
  };

  const simulateQRScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      onScan('QR123456789'); // Mock QR data
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Entry Validation</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setScanMode('qr')}
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
              onClick={() => setScanMode('pin')}
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
              <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center relative overflow-hidden">
                {isScanning ? (
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
                    <div className="animate-pulse text-blue-600">
                      <QrCode className="h-12 w-12" />
                    </div>
                  </div>
                ) : (
                  <Camera className="h-12 w-12 text-gray-400" />
                )}
                {/* Scanning overlay */}
                <div className="absolute inset-4 border-2 border-blue-600 rounded-lg">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-600 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-600 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-600 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-600 rounded-br-lg"></div>
                </div>
              </div>
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