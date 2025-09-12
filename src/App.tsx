import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./hooks/useAuth";
import LoginScreen from "./components/Auth/LoginScreen";
import ProfileSetup from "./components/Auth/ProfileSetup";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  const { user, loading, isNewUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Login route */}
        <Route
          path="/"
          element={!user ? <LoginScreen /> : <Navigate to="/dashboard" replace />}
        />

        {/* Profile setup route for new users */}
        <Route
          path="/profile-setup"
          element={user && isNewUser ? <ProfileSetup /> : <Navigate to="/dashboard" replace />}
        />

        {/* Dashboard route for logged-in users */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" replace />}
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}

export default App;
