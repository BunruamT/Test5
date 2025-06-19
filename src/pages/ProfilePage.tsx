import React, { useState } from 'react';
import { 
  User, 
  Car, 
  Receipt, 
  Bell, 
  Shield, 
  LogOut,
  Edit,
  Plus,
  Trash2,
  Download
} from 'lucide-react';
import { mockUser } from '../data/mockData';

export const ProfilePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'vehicles' | 'receipts' | 'settings'>('profile');
  const [user, setUser] = useState(mockUser);
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);

  const menuItems = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'vehicles', label: 'My Vehicles', icon: Car },
    { id: 'receipts', label: 'Payment History', icon: Receipt },
    { id: 'settings', label: 'Settings', icon: Shield },
  ];

  const mockReceipts = [
    {
      id: 'r1',
      date: '2024-01-15',
      spotName: 'Central Plaza Parking',
      amount: 200,
      method: 'Credit Card'
    },
    {
      id: 'r2', 
      date: '2024-01-12',
      spotName: 'Riverside Mall Parking',
      amount: 100,
      method: 'QR Payment'
    }
  ];

  const ProfileSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={user.name}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={user.phone}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Since
            </label>
            <input
              type="text"
              value="January 2024"
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const VehiclesSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">My Vehicles</h3>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Vehicle</span>
          </button>
        </div>

        <div className="space-y-4">
          {user.vehicles.map((vehicle) => (
            <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {vehicle.make} {vehicle.model}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {vehicle.licensePlate} • {vehicle.color}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ReceiptsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </button>
        </div>

        <div className="space-y-4">
          {mockReceipts.map((receipt) => (
            <div key={receipt.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {receipt.spotName}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{new Date(receipt.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{receipt.method}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    ${receipt.amount}
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SettingsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-600">Receive booking alerts and updates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <LogOut className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">Sign Out</p>
                <p className="text-sm text-gray-600">Sign out of your account</p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-800 font-medium transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSection />;
      case 'vehicles': return <VehiclesSection />;
      case 'receipts': return <ReceiptsSection />;
      case 'settings': return <SettingsSection />;
      default: return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};