import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, EyeOff, Mail, Lock, User, Building2, Car } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'customer-register' | 'owner-register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    businessAddress: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode !== 'login' && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // In a real app, this would handle authentication
    console.log('Form submitted:', { mode, formData });
    
    // Simulate successful login/registration and redirect based on account type
    if (mode === 'owner-register') {
      // Property owner registration - go to admin dashboard
      navigate('/admin');
    } else if (mode === 'login') {
      // For login, check email patterns to determine account type
      if (formData.email.includes('owner') || formData.email.includes('admin') || formData.email.includes('property')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      // Customer registration - go to main app
      navigate('/');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      businessName: '',
      businessAddress: ''
    });
  };

  const switchMode = (newMode: typeof mode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ParkPass
            </span>
          </div>
          <p className="text-gray-600">
            {mode === 'login' && 'Welcome back to the future of parking'}
            {mode === 'customer-register' && 'Find and book parking spots instantly'}
            {mode === 'owner-register' && 'Start earning from your parking spaces'}
          </p>
        </div>

        {/* Account Type Selection (only show when not in login mode) */}
        {mode !== 'login' && (
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => switchMode('customer-register')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  mode === 'customer-register'
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Car className={`h-6 w-6 mx-auto mb-2 ${
                  mode === 'customer-register' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <div className={`font-semibold ${
                  mode === 'customer-register' ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  Driver
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Find & book parking
                </div>
              </button>
              
              <button
                onClick={() => switchMode('owner-register')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  mode === 'owner-register'
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Building2 className={`h-6 w-6 mx-auto mb-2 ${
                  mode === 'owner-register' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <div className={`font-semibold ${
                  mode === 'owner-register' ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  Owner
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  List your spaces
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === 'login' && 'Sign In'}
              {mode === 'customer-register' && 'Create Driver Account'}
              {mode === 'owner-register' && 'Create Owner Account'}
            </h2>
            <p className="text-gray-600">
              {mode === 'login' && 'Enter your credentials to access your account'}
              {mode === 'customer-register' && 'Join thousands of drivers finding perfect parking'}
              {mode === 'owner-register' && 'Start monetizing your parking spaces today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field (Registration only) */}
            {mode !== 'login' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300"
                    required
                  />
                </div>
              </div>
            )}

            {/* Business Name (Owner registration only) */}
            {mode === 'owner-register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Your business or property name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300"
                  required
                />
              </div>
            </div>

            {/* Phone Field (Registration only) */}
            {mode !== 'login' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300"
                  required
                />
              </div>
            )}

            {/* Business Address (Owner registration only) */}
            {mode === 'owner-register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  placeholder="Primary business location"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300"
                  required
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {mode !== 'login' && (
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters with letters and numbers
                </p>
              )}
            </div>

            {/* Confirm Password Field (Registration only) */}
            {mode !== 'login' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me / Forgot Password (Login only) */}
            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms and Conditions (Registration only) */}
            {mode !== 'login' && (
              <div className="flex items-start space-x-3">
                <input 
                  type="checkbox" 
                  required 
                  className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    Privacy Policy
                  </button>
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {mode === 'login' && 'Sign In'}
              {mode === 'customer-register' && 'Create Driver Account'}
              {mode === 'owner-register' && 'Create Owner Account'}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            {mode === 'login' ? (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => switchMode('customer-register')}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  Sign up as a driver
                </button>
                {' '}or{' '}
                <button
                  onClick={() => switchMode('owner-register')}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  list your parking space
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Social Login (Optional) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
                <span className="text-sm font-medium text-gray-700">Apple</span>
              </button>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Demo Credentials
          </h4>
          <div className="text-sm text-blue-800 space-y-2">
            <div className="flex justify-between items-center">
              <span><strong>Driver:</strong> driver@demo.com</span>
              <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded">demo123</span>
            </div>
            <div className="flex justify-between items-center">
              <span><strong>Owner:</strong> owner@demo.com</span>
              <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded">demo123</span>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        {mode !== 'login' && (
          <div className="mt-6 text-center">
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
                  <span className="text-green-600">✓</span>
                </div>
                <span>Instant Booking</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
                  <span className="text-green-600">✓</span>
                </div>
                <span>Secure Payments</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
                  <span className="text-green-600">✓</span>
                </div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};