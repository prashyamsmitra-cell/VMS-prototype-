import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VMSProvider } from './context/VMSContext';
import { ToastProvider } from './components/ToastContainer';
import { LoginHistoryProvider } from './context/LoginHistoryContext';

import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './routes/LandingPage';
import AdminLogin from './routes/AdminLogin';
import VisitorOfficeSelect from './routes/VisitorOfficeSelect';
import VisitorPage from './routes/VisitorPage';
import AdminDashboard from './routes/AdminDashboard';
import LocationsPage from './routes/LocationsPage';
import EmployeesPage from './routes/EmployeesPage';
import LoginHistoryPage from './routes/LoginHistoryPage';

function App() {
  return (
    <Router>
      <LoginHistoryProvider>
        <AuthProvider>
          <VMSProvider>
            <ToastProvider>
              <Header />
              <main className="min-h-screen">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/visitor-office-select" element={<VisitorOfficeSelect />} />
                  <Route path="/location/:locationId" element={<VisitorPage />} />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/locations"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <LocationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/employees"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <EmployeesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/login-history"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <LoginHistoryPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch All */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </ToastProvider>
          </VMSProvider>
        </AuthProvider>
      </LoginHistoryProvider>
    </Router>
  );
}

export default App;
