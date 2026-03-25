import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || location.pathname === '/') {
    return null;
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...pathnames.map((name, index) => ({
      label: name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      href: `/${pathnames.slice(0, index + 1).join('/')}`,
    })),
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <div key={item.href} className="flex items-center gap-2">
              {index > 0 && <span className="text-red-500 font-semibold">/</span>}
              {index === breadcrumbItems.length - 1 ? (
                <span className="font-semibold text-slate-900 bg-red-50 px-3 py-1 rounded-full">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-red-600 hover:text-red-700 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
