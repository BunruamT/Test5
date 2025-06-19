import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, User, Calendar, Settings, Home, LogOut, Bell, Clock, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  // Mock user state - in real app this would come from auth context
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userType, setUserType] = useState<'customer' | 'admin'>('customer');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUserMenu(false);
    setShowMobileMenu(false);
    navigate('/login');
  };

  const mockNotifications = [
    { id: 1, message: 'Booking confirmed for Central Plaza', time: '5 min ago', unread: true },
    { id: 2, message: 'Parking session ending in 30 minutes', time: '15 min ago', unread: true },
    { id: 3, message: 'Payment receipt available', time: '1 hour ago', unread: false },
  ];

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  // Function to close all dropdowns/menus
  const closeAllMenus = () => {
    setShowUserMenu(false);
    setShowNotifications(false);
    setShowMobileMenu(false);
  };

  // Condition to show background overlay
  const showBackgroundOverlay = showUserMenu || showNotifications || showMobileMenu;

  // --- Start of Navbar component render ---
  return (
    <> {/* Fragment to allow rendering the Navbar and then the Overlay separately */}
      <nav className="fixed top-0 w-full bg-white shadow-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ParkPass</span>
            </Link>

            {/* Desktop Navigation */}
            {/* <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>

              {userType === 'customer' && (
                <Link
                  to="/bookings"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/bookings')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>My Bookings</span>
                </Link>
              )}

              {userType === 'admin' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div> */}

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false); // Close user menu when opening notifications
                  }}
                  className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false); // Close notifications when opening user menu
                  }}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">John Doe</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">John Doe</p>
                      <p className="text-sm text-gray-600">john@example.com</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      {userType === 'customer' && (
                        <Link
                          to="/bookings"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>My Bookings</span>
                        </Link>
                      )}
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </div>
                    <div className="border-t border-gray-200 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Notifications Toggle */}
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMobileMenu(false); // Close mobile menu when opening notifications
                }}
                className="relative p-2 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => {
                  setShowMobileMenu(!showMobileMenu);
                  setShowNotifications(false); // Close notifications when opening mobile menu
                }}
                className="p-2 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (now positioned relative to the viewport, not the nav itself) */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white fixed w-full top-16 left-0 z-50 shadow-lg"> {/* Added fixed, left-0, shadow-lg */}
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* User Info */}
              <div className="px-3 py-3 border-b border-gray-200 mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-600">john@example.com</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>

              {userType === 'customer' && (
                <Link
                  to="/bookings"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/bookings')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Calendar className="h-5 w-5" />
                  <span>My Bookings</span>
                </Link>
              )}

              {userType === 'admin' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/admin')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>

              <Link
                to="/settings"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>

              {/* Logout */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Notifications Dropdown (now positioned relative to the viewport) */}
        {showNotifications && (
          <div className="md:hidden fixed left-0 right-0 top-16 bg-white border-b border-gray-200 shadow-lg z-50"> {/* Added fixed, shadow-lg */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    notification.unread ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200">
              <button
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setShowNotifications(false)}
              >
                View all notifications
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Background Overlay (this div is now a sibling to <nav> to ensure correct z-indexing) */}
      {showBackgroundOverlay && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40" // Z-index is 40, lower than Navbar (50)
          onClick={closeAllMenus}
        />
      )}
    </>
  );
};