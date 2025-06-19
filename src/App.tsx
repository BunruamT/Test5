import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes with Navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              {/* เพิ่ม div นี้เพื่อดันเนื้อหาลงมา */}
              <div className="pt-16"> {/* <--- เพิ่มคลาส pt-16 ที่นี่ */}
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/spot/:id" element={<ParkingSpotDetail />} />
                  <Route path="/book/:id" element={<BookingPage />} />
                  <Route path="/bookings" element={<BookingsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/add-spot" element={<AddParkingSpot />} />
                  <Route path="/admin/edit-spot/:id" element={<EditParkingSpot />} />
                  <Route path="/admin/availability/:id" element={<ManageAvailability />} />
                </Routes>
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;