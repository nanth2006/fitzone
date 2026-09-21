import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserDashboard from './pages/userDashboard.jsx';
import Workouts from './pages/workouts.jsx';
import Trainer from './pages/trainer.jsx';
import Membership from './pages/membership.jsx';
import Profile from './pages/profile.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AddWorkout from './pages/admin/addworkouts.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

function App() {
  return (
    <Routes>
      {/* Public / Landing routes */}
      <Route path="/" element={<UserDashboard />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/workout" element={<Workouts />} />
      
      <Route path="/trainer" element={<Trainer />} />
   
      <Route path="/membership" element={<Membership />} />
    

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Member Protected Dashboard */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin Portal */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/add-workout"
        element={
          <AdminRoute>
            <AddWorkout />
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
