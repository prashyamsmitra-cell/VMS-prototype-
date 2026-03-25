import { Link } from 'react-router-dom';
import { useVMS } from '../context/VMSContext';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';

export default function AdminDashboard() {
  const { locations, employees } = useVMS();

  const dashboardCards = [
    {
      id: 'locations',
      title: 'Locations',
      icon: '🏢',
      count: locations.length,
      description: 'Manage office locations',
      path: '/admin/locations',
      color: 'red',
    },
    {
      id: 'employees',
      title: 'Employees',
      icon: '👥',
      count: employees.length,
      description: 'Manage staff members',
      path: '/admin/employees',
      color: 'blue',
    },
    {
      id: 'history',
      title: 'Login History',
      icon: '📋',
      count: '∞',
      description: 'View access logs',
      path: '/admin/login-history',
      color: 'purple',
    },
  ];

  const colorStyles = {
    red: 'from-red-500 to-red-600 text-red-600',
    blue: 'from-blue-500 to-blue-600 text-blue-600',
    purple: 'from-purple-500 to-purple-600 text-purple-600',
  };

  return (
    <>
      <Breadcrumb />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
              Admin Dashboard
            </h1>
            <p className="text-lg text-slate-600">
              Welcome back! Manage your visitor management system
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {dashboardCards.map((card) => (
              <Link key={card.id} to={card.path}>
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`text-4xl`}>{card.icon}</div>
                    <span className="text-3xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      {card.count}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{card.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Tips Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">💡 Pro Tips</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Add New Locations</h3>
                <p className="text-slate-600 text-sm">
                  Go to the Locations page to add new office locations and generate QR codes for check-ins.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Manage Employees</h3>
                <p className="text-slate-600 text-sm">
                  Keep your employee list updated in the Employees section to ensure accurate host assignments.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Track Visitors</h3>
                <p className="text-slate-600 text-sm">
                  Monitor all check-ins through the Login History page to maintain security and access logs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Share QR Codes</h3>
                <p className="text-slate-600 text-sm">
                  Use the QR codes from locations to streamline visitor check-in process at your offices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
