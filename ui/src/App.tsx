import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PatientProvider } from "./context/PatientContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/PatientList";
import PatientCard from "./pages/PatientCard";
import NewPatient from "./pages/NewPatient";
import CardsList from "./pages/CardsList";

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show loading spinner while checking auth status
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <PatientProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <PatientList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/patients/new"
              element={
                <ProtectedRoute>
                  <NewPatient />
                </ProtectedRoute>
              }
            />

            <Route
              path="/patients/:id/card"
              element={
                <ProtectedRoute>
                  <PatientCard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cards"
              element={
                <ProtectedRoute>
                  <CardsList />
                </ProtectedRoute>
              }
            />

            {/* Catch all redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </PatientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
