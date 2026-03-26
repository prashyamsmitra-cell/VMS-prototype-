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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Visitor Check-in at {location.name}
            </h1>
            <p className="text-slate-600">Complete the form below to check in</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Visitor Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="visitorName"
                          value={formData.visitorName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 border rounded-lg ${
                            errors.visitorName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.visitorName && (
                          <p className="text-red-500 text-sm mt-1">{errors.visitorName}</p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="visitorEmail"
                            value={formData.visitorEmail}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className={`w-full px-4 py-3 border rounded-lg ${
                              errors.visitorEmail ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.visitorEmail && (
                            <p className="text-red-500 text-sm mt-1">{errors.visitorEmail}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            name="visitorPhone"
                            value={formData.visitorPhone}
                            onChange={handleInputChange}
                            placeholder="9876543210"
                            className={`w-full px-4 py-3 border rounded-lg ${
                              errors.visitorPhone ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.visitorPhone && (
                            <p className="text-red-500 text-sm mt-1">{errors.visitorPhone}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Your Company (optional)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Visit Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          Host Name *
                        </label>
                        <select
                          name="hostName"
                          value={formData.hostName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg ${
                            errors.hostName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select a host...</option>
                          {locationEmployees.map((employee) => (
                            <option key={employee.id} value={employee.name}>
                              {employee.name} ({employee.department})
                            </option>
                          ))}
                        </select>
                        {errors.hostName && (
                          <p className="text-red-500 text-sm mt-1">{errors.hostName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          Purpose of Visit *
                        </label>
                        <input
                          type="text"
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          placeholder="E.g., Meeting, Interview, Delivery"
                          className={`w-full px-4 py-3 border rounded-lg ${
                            errors.purpose ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.purpose && (
                          <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full">
                    {isSubmitting ? 'Checking in...' : 'Complete Check-in'}
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <QRCard location={location} />

              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4">Today's Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Visitors Checked In</span>
                    <span className="font-bold text-red-600 text-lg">{recentCheckIns.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Currently Present</span>
                    <span className="font-bold text-blue-600 text-lg">{recentCheckIns.length}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <p className="text-xs text-slate-500">Location Capacity: {location.capacity}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 max-h-80 overflow-y-auto">
                <h3 className="font-bold text-slate-900 mb-4">Recent Check-ins</h3>
                {recentCheckIns.length > 0 ? (
                  <div className="space-y-3">
                    {recentCheckIns.map((checkIn) => (
                      <div key={checkIn.id} className="pb-3 border-b border-gray-200 last:border-0 text-xs">
                        <p className="font-semibold text-slate-900">{checkIn.name}</p>
                        <p className="text-slate-600">Host: {checkIn.host}</p>
                        <p className="text-slate-500">{checkIn.time}</p>
                        <p className="text-slate-500">Purpose: {checkIn.purpose}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No recent visitors checked in yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
