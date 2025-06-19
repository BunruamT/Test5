import React from 'react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  value, 
  size = 200, 
  className = "" 
}) => {
  // In a real app, you'd use a QR code library like 'qrcode' or 'react-qr-code'
  // For this demo, we'll create a visual representation
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        className="border-2 border-gray-200 rounded-lg p-4 bg-white"
        style={{ width: size + 32, height: size + 32 }}
      >
        <img 
          src={qrCodeUrl}
          alt="QR Code"
          width={size}
          height={size}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};