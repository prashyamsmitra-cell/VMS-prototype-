import { useState, useMemo } from 'react';
import { useLoginHistory } from '../context/LoginHistoryContext';
import Button from '../components/Button';
import Breadcrumb from '../components/Breadcrumb';

export default function LoginHistoryPage() {
  const { loginHistory, isLoading, clearHistory } = useLoginHistory();
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredAndSorted = useMemo(() => {
    let filtered = loginHistory;

    if (filterType !== 'all') {
      filtered = filtered.filter((entry) => entry.userType === filterType);
    }

    return sortOrder === 'newest' ? filtered : [...filtered].reverse();
  }, [loginHistory, filterType, sortOrder]);

  const groupedByDate = useMemo(() => {
    const grouped = {};
    filteredAndSorted.forEach((entry) => {
      if (!grouped[entry.date]) {
        grouped[entry.date] = [];
      }
      grouped[entry.date].push(entry);
    });
    return grouped;
  }, [filteredAndSorted]);

  const stats = useMemo(() => {
    const visitors = loginHistory.filter((entry) => entry.userType === 'visitor').length;
    const admins = loginHistory.filter((entry) => entry.userType === 'admin').length;

    return {
      total: loginHistory.length,
      visitors,
      admins,
    };
  }, [loginHistory]);

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all login history? This action cannot be undone.')) {
      await clearHistory();
    }
  };

  return (
    <>
      <Breadcrumb />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Login History</h1>
            <p className="text-slate-600">Track all visitor and admin access logs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <p className="text-slate-600 text-sm font-semibold mb-2">Total Logins</p>
              <p className="text-4xl font-bold text-red-600">{stats.total}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <p className="text-slate-600 text-sm font-semibold mb-2">Visitor Logins</p>
              <p className="text-4xl font-bold text-blue-600">{stats.visitors}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <p className="text-slate-600 text-sm font-semibold mb-2">Admin Logins</p>
              <p className="text-4xl font-bold text-purple-600">{stats.admins}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-8 text-sm text-blue-800">
            <p className="font-semibold mb-1">About This Data</p>
            <p>Login records are loaded from the shared backend so admins can see the same activity across devices.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Filter by Type</label>
                <select
                  value={filterType}
                  onChange={(event) => setFilterType(event.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Users</option>
                  <option value="visitor">Visitors Only</option>
                  <option value="admin">Admins Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Sort Order</label>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleClearHistory} variant="outline" className="w-full">
                  Clear History
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
              <p className="text-slate-500 text-lg">Loading login history...</p>
            </div>
          ) : Object.keys(groupedByDate).length > 0 ? (
            <div className="space-y-6">
              {Object.keys(groupedByDate)
                .sort((left, right) => new Date(right) - new Date(left))
                .map((date) => (
                  <div key={date} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-50 to-blue-50 border-b border-gray-200 px-6 py-4">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        {new Date(date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        <span className="text-sm font-normal text-slate-600 ml-2">
                          ({groupedByDate[date].length} logins)
                        </span>
                      </h3>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {groupedByDate[date].map((entry) => (
                        <div key={entry.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-grow">
                              <p className="font-semibold text-slate-900">{entry.userName}</p>
                              <p className="text-sm text-slate-600">
                                {entry.userType === 'visitor' ? `Location: ${entry.locationName}` : 'Admin Access'}
                              </p>
                              <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                <span>{entry.time}</span>
                                <span>{entry.timezone}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                entry.userType === 'visitor'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {entry.userType === 'visitor' ? 'Visitor' : 'Admin'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
              <p className="text-slate-500 text-lg mb-4">No login records yet</p>
              <p className="text-slate-400 text-sm">Start by checking in as a visitor or logging in as an admin.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
