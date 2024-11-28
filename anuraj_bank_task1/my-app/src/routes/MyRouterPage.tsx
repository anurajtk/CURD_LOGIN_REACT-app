import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';

// A simple PrivateRoute component to check for valid token
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = sessionStorage.getItem('authToken'); // You can use localStorage instead

console.log(token,'myToken');
  // If there's no token, redirect to Login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child route (Dashboard)
  return <>{children}</>;
};

const MyRouterPage: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Private Route for the Dashboard, only accessible if there's a valid token */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Redirect the user to Dashboard if they are already logged in */}
        <Route
          path="/"
          element={<Navigate to={sessionStorage.getItem('authToken') ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </Router>
  );
};

export default MyRouterPage;
