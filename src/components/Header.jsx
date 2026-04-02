import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();

  const hideHeader = ['/'].includes(location.pathname)
    || location.pathname.includes('/admin-login')
    || location.pathname.includes('/visitor-office-select');

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
      <div className="bg-green-50 border-b border-green-200 px-4 py-2 text-center">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold text-green-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          System Operational
        </p>
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent transition-opacity hover:opacity-80"
        >
          VMS
        </Link>

        <div className="hidden items-center gap-4 sm:flex">
          {isAdminRoute && isLoggedIn ? (
            <>
              <Link to="/admin" className="font-medium text-slate-700 transition-colors hover:text-red-600">
                Dashboard
              </Link>
              <Link to="/admin/locations" className="font-medium text-slate-700 transition-colors hover:text-red-600">
                Locations
              </Link>
              <Link to="/admin/employees" className="font-medium text-slate-700 transition-colors hover:text-red-600">
                Employees
              </Link>
              <Link to="/admin/login-history" className="font-medium text-slate-700 transition-colors hover:text-red-600">
                History
              </Link>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="hidden text-sm font-medium text-slate-600 sm:inline">
                {user?.type === 'admin' ? `${user.name} (Admin)` : 'Visitor'}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : location.pathname.includes('/location/') ? (
            <Link to="/visitor-office-select" className="font-semibold text-red-600 transition-colors hover:text-red-700">
              Back
            </Link>
          ) : null}
        </div>

        <div className="text-xl sm:hidden">
          {isLoggedIn && (
            <span className="text-xs font-bold text-red-600">
              {user?.type === 'admin' ? 'Admin' : 'Visitor'}
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}
