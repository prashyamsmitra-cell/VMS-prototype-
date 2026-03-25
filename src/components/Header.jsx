import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();

  // Don't show header on landing page or authentication pages
  const hideHeader = ['/'].includes(location.pathname) ||
    location.pathname.includes('/admin-login') ||
    location.pathname.includes('/visitor-office-select');

  if (hideHeader) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Status Bar */}
      <div className="bg-green-50 border-b border-green-200 px-4 py-2 text-center">
        <p className="text-xs font-semibold text-green-700 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          System Operational
        </p>
      </div>

      {/* Main Header */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-2xl bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          VMS
        </Link>

        {/* Navigation */}
        <div className="hidden sm:flex items-center gap-4">
          {isAdminRoute && isLoggedIn ? (
            <>
              <Link to="/admin" className="text-slate-700 hover:text-red-600 transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="/admin/locations" className="text-slate-700 hover:text-red-600 transition-colors font-medium">
                Locations
              </Link>
              <Link to="/admin/employees" className="text-slate-700 hover:text-red-600 transition-colors font-medium">
                Employees
              </Link>
              <Link to="/admin/login-history" className="text-slate-700 hover:text-red-600 transition-colors font-medium">
                History
              </Link>
            </>
          ) : null}
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="hidden sm:inline text-sm text-slate-600 font-medium">
                {user?.type === 'admin' ? `${user.name} (Admin)` : 'Visitor'}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : location.pathname.includes('/location/') ? (
            <Link to="/visitor-office-select" className="text-red-600 hover:text-red-700 font-semibold transition-colors">
              ← Back
            </Link>
          ) : null}
        </div>

        {/* Mobile Menu Icon */}
        <div className="sm:hidden text-xl">
          {isLoggedIn && <span className="text-xs font-bold text-red-600">{user?.type === 'admin' ? '⚙️' : '👤'}</span>}
        </div>
      </nav>
    </header>
  );
}
