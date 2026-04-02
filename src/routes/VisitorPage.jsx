import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVMS } from '../context/VMSContext';
import { useToast } from '../context/ToastContext';
import { employeesApi, visitsApi } from '../services/api';
import Button from '../components/Button';
import QRCard from '../components/QRCard';
import Breadcrumb from '../components/Breadcrumb';

export default function VisitorPage() {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const { locations, isLoading: isLocationsLoading } = useVMS();
  const { showToast } = useToast();

  const location = useMemo(() => locations.find((item) => item.id == locationId), [locations, locationId]);

  const [formData, setFormData] = useState({
    visitorName: '',
    visitorEmail: '',
    visitorPhone: '',
    hostName: '',
    purpose: '',
    companyName: '',
  });
  const [locationEmployees, setLocationEmployees] = useState([]);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const loadLocationEmployees = useCallback(async () => {
    if (!locationId) return;

    try {
      const employees = await employeesApi.getByLocation(locationId);
      setLocationEmployees(employees);
    } catch (error) {
      console.error('Error loading employees for visitor page:', error);
      setLocationEmployees([]);
    }
  }, [locationId]);

  const loadRecentCheckIns = useCallback(async () => {
    if (!locationId) return;

    try {
      const visits = await visitsApi.getRecent(locationId);
      setRecentCheckIns(
        visits.map((visit, index) => ({
          id: `${visit.visitor_name}-${visit.time}-${index}`,
          name: visit.visitor_name,
          host: visit.host_name,
          time: visit.time,
          purpose: visit.purpose,
        })),
      );
    } catch (error) {
      console.error('Error loading recent check-ins:', error);
      setRecentCheckIns([]);
    }
  }, [locationId]);

  useEffect(() => {
    loadLocationEmployees();
    loadRecentCheckIns();
  }, [loadLocationEmployees, loadRecentCheckIns]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.visitorName.trim()) newErrors.visitorName = 'Name is required';
    if (!formData.visitorEmail.trim()) newErrors.visitorEmail = 'Email is required';
    if (!formData.visitorPhone.trim()) newErrors.visitorPhone = 'Phone is required';
    if (!formData.hostName) newErrors.hostName = 'Please select a host';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    return newErrors;
  };

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await visitsApi.checkIn({ ...formData, locationId });
      await loadRecentCheckIns();
      showToast('Check-in successful! Welcome.', 'success');
      setErrors({});
      setFormData({
        visitorName: '',
        visitorEmail: '',
        visitorPhone: '',
        hostName: '',
        purpose: '',
        companyName: '',
      });
    } catch (error) {
      showToast(error.message || 'Check-in failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, locationId, loadRecentCheckIns, showToast]);

  if (isLocationsLoading && !location) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-slate-600 text-lg">Loading location...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg mb-4">Location not found</p>
          <Button onClick={() => navigate('/visitor-office-select')}>
            Back to Locations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-10 sm:mb-12">
            <div className="mb-6 flex items-center gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate('/visitor-office-select')}>
                ← Back
              </Button>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
              Check in at <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">{location.name}</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600">
              Welcome! Complete the form below to check in
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="card-base p-6 sm:p-8 space-y-8">
                {/* Visitor Information Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">👤</span>
                    <h3 className="text-xl font-bold text-slate-900">Visitor Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="visitorName"
                        value={formData.visitorName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-250 font-medium ${
                          errors.visitorName ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      />
                      {errors.visitorName && (
                        <p className="text-red-500 text-xs font-semibold mt-1.5">✗ {errors.visitorName}</p>
                      )}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="visitorEmail"
                          value={formData.visitorEmail}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-250 font-medium ${
                            errors.visitorEmail ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        />
                        {errors.visitorEmail && (
                          <p className="text-red-500 text-xs font-semibold mt-1.5">✗ {errors.visitorEmail}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2.5">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="visitorPhone"
                          value={formData.visitorPhone}
                          onChange={handleInputChange}
                          placeholder="9876543210"
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-250 font-medium ${
                            errors.visitorPhone ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        />
                        {errors.visitorPhone && (
                          <p className="text-red-500 text-xs font-semibold mt-1.5">✗ {errors.visitorPhone}</p>
                        )}
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your Company (optional)"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-250 font-medium hover:border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Visit Details Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">📝</span>
                    <h3 className="text-xl font-bold text-slate-900">Visit Details</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Host Name */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2.5">
                        Who are you meeting? *
                      </label>
                      <select
                        name="hostName"
                        value={formData.hostName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-250 font-medium cursor-pointer ${
                          errors.hostName ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <option value="">Select a host...</option>
                        {locationEmployees.map((employee) => (
                          <option key={employee.id} value={employee.name}>
                            {employee.name} - {employee.department}
                          </option>
                        ))}
                      </select>
                      {errors.hostName && (
                        <p className="text-red-500 text-xs font-semibold mt-1.5">✗ {errors.hostName}</p>
                      )}
                    </div>

                    {/* Purpose of Visit */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2.5">
                        Purpose of Visit *
                      </label>
                      <input
                        type="text"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        placeholder="E.g., Meeting, Interview, Delivery"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-250 font-medium ${
                          errors.purpose ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      />
                      {errors.purpose && (
                        <p className="text-red-500 text-xs font-semibold mt-1.5">✗ {errors.purpose}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={isSubmitting} variant="primary" size="lg" className="w-full">
                  {isSubmitting ? '⏳ Checking in...' : '✓ Complete Check-in'}
                </Button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* QR Card */}
              <QRCard location={location} />

              {/* Today's Stats */}
              <div className="card-base p-6 sm:p-8">
                <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  Today's Activity
                </h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-lg p-4 border border-red-100">
                    <p className="text-xs text-red-700 font-semibold">Visitors Checked In</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">{recentCheckIns.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-100">
                    <p className="text-xs text-blue-700 font-semibold">Currently Present</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{recentCheckIns.length}</p>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs text-slate-600 font-semibold">Location Capacity</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{location.capacity}</p>
                  </div>
                </div>
              </div>

              {/* Recent Check-ins */}
              <div className="card-base p-6 sm:p-8 max-h-96 overflow-y-auto flex flex-col">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 flex-shrink-0">
                  <span className="text-xl">👥</span>
                  Recent Visitors
                </h3>
                {recentCheckIns.length > 0 ? (
                  <div className="space-y-3 flex-1">
                    {recentCheckIns.map((checkIn) => (
                      <div key={checkIn.id} className="pb-3 border-b border-gray-100 last:border-0 text-xs">
                        <p className="font-bold text-slate-900">{checkIn.name}</p>
                        <p className="text-slate-600 text-xs mt-1">👤 {checkIn.host}</p>
                        <p className="text-slate-500 text-xs mt-0.5">⏰ {checkIn.time}</p>
                        <p className="text-slate-500 text-xs mt-0.5">📌 {checkIn.purpose}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 flex-shrink-0">
                    <div className="text-3xl mb-2">👋</div>
                    <p className="text-sm text-slate-600">No visitors yet today</p>
                    <p className="text-xs text-slate-500 mt-1">You'll be the first!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
