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
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100/50',
      icon: 'text-red-600',
      accent: 'from-red-500 to-red-600',
      border: 'border-red-200 hover:border-red-300',
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
      icon: 'text-blue-600',
      accent: 'from-blue-500 to-blue-600',
      border: 'border-blue-200 hover:border-blue-300',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50',
      icon: 'text-purple-600',
      accent: 'from-purple-500 to-purple-600',
      border: 'border-purple-200 hover:border-purple-300',
    },
  };

  return (
    <>
      <Breadcrumb />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          {/* Header Section */}
          <div className="mb-14 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
              Admin Dashboard
            </h1>
            <p className="text-base sm:text-lg text-slate-600">
              Welcome! Manage your visitor management system
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
            {dashboardCards.map((card) => {
              const style = colorStyles[card.color] || colorStyles.red;
              return (
                <Link key={card.id} to={card.path}>
                  <div className={`card-base card-hover ${style.bg} ${style.border} p-6 sm:p-8 group cursor-pointer relative overflow-hidden`}>
                    {/* Top Accent Stripe */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.accent} opacity-75 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`text-5xl sm:text-6xl ${style.icon} group-hover:scale-110 transition-transform duration-300 origin-left`}>
                          {card.icon}
                        </div>
                        <span className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${style.accent} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 origin-right`}>
                          {card.count}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                      <p className="text-slate-600 text-sm mb-6">{card.description}</p>
                      <Button variant={card.color === 'red' ? 'outline' : 'secondary_outline'} size="sm" className="w-full">
                        View Details →
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Tips Section */}
          <div className="card-base card-hover bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-blue-100 p-8 sm:p-10 relative overflow-hidden">
            {/* Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500" />

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="text-2xl">💡</span>
              Quick Start Guide
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Add New Locations',
                  description: 'Go to the Locations page to add new office locations and generate QR codes for visitor check-ins.'
                },
                {
                  title: 'Manage Employees',
                  description: 'Keep your employee list updated in the Employees section to ensure accurate host assignments.'
                },
                {
                  title: 'Track Visitors',
                  description: 'Monitor all check-ins through the Login History page to maintain security and access logs.'
                },
                {
                  title: 'Share QR Codes',
                  description: 'Use the QR codes from locations to streamline the visitor check-in process at your offices.'
                },
              ].map((tip, idx) => (
                <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                  <h3 className="font-bold text-slate-900 mb-2 text-base sm:text-lg flex items-center gap-2">
                    <span className="text-blue-500">→</span>
                    {tip.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
