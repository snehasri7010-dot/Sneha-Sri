import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  AdminBookingsPage,
  AdminCarsPage,
  AdminDashboard,
  AdminOverviewPage,
  AdminProfilePage,
  AdminUsersPage,
  OwnerAddCarPage,
  OwnerBookingRequestsPage,
  OwnerCarsPage,
  OwnerDashboard,
  OwnerProfilePage,
  RenterBookCarPage,
  RenterBookingHistoryPage,
  RenterBrowseCarsPage,
  RenterCancelBookingPage,
  RenterDashboard,
  RenterProfilePage,
  RenterSearchCarsPage,
} from './pages/Dashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Register from './pages/Register.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="cars" element={<AdminCarsPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>
      <Route
        path="/owner-dashboard"
        element={
          <ProtectedRoute allowedRole="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<OwnerProfilePage />} />
        <Route path="cars" element={<OwnerCarsPage />} />
        <Route path="add-car" element={<OwnerAddCarPage />} />
        <Route path="booking-requests" element={<OwnerBookingRequestsPage />} />
        <Route path="*" element={<Navigate to="profile" replace />} />
      </Route>
      <Route
        path="/renter-dashboard"
        element={
          <ProtectedRoute allowedRole="renter">
            <RenterDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<RenterProfilePage />} />
        <Route path="search-cars" element={<RenterSearchCarsPage />} />
        <Route path="browse-cars" element={<RenterBrowseCarsPage />} />
        <Route path="book-car" element={<RenterBookCarPage />} />
        <Route path="booking-history" element={<RenterBookingHistoryPage />} />
        <Route path="cancel-booking" element={<RenterCancelBookingPage />} />
        <Route path="*" element={<Navigate to="profile" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
