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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm-light">
      {/* Status Bar */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-4 py-2">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse-subtle" />
          System Operational
        </p>
      </div>

      {/* Navigation Bar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex-shrink-0 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent transition-opacity hover:opacity-75 duration-250"
        >
          VMS
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 sm:flex">
          {isAdminRoute && isLoggedIn ? (
            <>
              <Link to="/admin" className="px-3 py-2 font-medium text-slate-700 rounded-lg transition-colors hover:text-red-600 hover:bg-red-50 duration-250">
                Dashboard
              </Link>
              <Link to="/admin/locations" className="px-3 py-2 font-medium text-slate-700 rounded-lg transition-colors hover:text-red-600 hover:bg-red-50 duration-250">
                Locations
              </Link>
              <Link to="/admin/employees" className="px-3 py-2 font-medium text-slate-700 rounded-lg transition-colors hover:text-red-600 hover:bg-red-50 duration-250">
                Employees
              </Link>
              <Link to="/admin/login-history" className="px-3 py-2 font-medium text-slate-700 rounded-lg transition-colors hover:text-red-600 hover:bg-red-50 duration-250">
                History
              </Link>
            </>
          ) : null}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 ml-auto">
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
            <Link to="/visitor-office-select">
              <Button variant="ghost" size="sm">
                ← Back
              </Button>
            </Link>
          ) : null}
        </div>

        {/* Mobile User Indicator */}
        <div className="text-xs sm:hidden">
          {isLoggedIn && (
            <span className="font-bold text-red-600">
              {user?.type === 'admin' ? 'Admin' : 'Visitor'}
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}
