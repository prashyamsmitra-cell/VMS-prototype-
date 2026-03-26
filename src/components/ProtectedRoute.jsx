import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-slate-600 font-medium">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  if (requiredRole && user?.type !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
