import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import FeedPage from "./pages/FeedPage"; // REAL FeedPage
import ProfilePage from "./pages/ProfilePage"; // ProfilePage
import ProtectedRoute from "./components/ProtectedRoute"; // Extracted component

function App() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          // If already logged in, redirect to feed
          isAuthenticated ? <Navigate to="/feed" /> : <AuthPage />
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      {/* Any other route will redirect to feed or login */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/feed" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
