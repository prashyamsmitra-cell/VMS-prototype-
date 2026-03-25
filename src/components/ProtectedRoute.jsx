import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  if (requiredRole && user?.type !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
