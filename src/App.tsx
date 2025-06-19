import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ParkingSpotDetail } from './pages/ParkingSpotDetail';
import { BookingPage } from './pages/BookingPage';
import { BookingsPage } from './pages/BookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { AddParkingSpot } from './pages/AddParkingSpot';
import { EditParkingSpot } from './pages/EditParkingSpot';
import { ManageAvailability } from './pages/ManageAvailability';

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  requiredRole?: 'user' | 'owner' | 'admin';
}> = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && profile.role !== requiredRole && profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        
        {/* Protected Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/spot/:id" element={<ParkingSpotDetail />} />
                <Route path="/book/:id" element={<BookingPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Owner/Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="owner">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/add-spot" element={
                  <ProtectedRoute requiredRole="owner">
                    <AddParkingSpot />
                  </ProtectedRoute>
                } />
                <Route path="/admin/edit-spot/:id" element={
                  <ProtectedRoute requiredRole="owner">
                    <EditParkingSpot />
                  </ProtectedRoute>
                } />
                <Route path="/admin/availability/:id" element={
                  <ProtectedRoute requiredRole="owner">
                    <ManageAvailability />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;