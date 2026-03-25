import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVMS } from '../context/VMSContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import QRCard from '../components/QRCard';
import Breadcrumb from '../components/Breadcrumb';

export default function VisitorPage() {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const { locations, employees } = useVMS();
  const { showToast } = useToast();

  const location = useMemo(() => locations.find((l) => l.id == locationId), [locations, locationId]);
  const locationEmployees = useMemo(() => employees.filter((e) => e.locationId == locationId), [employees, locationId]);

  const [formData, setFormData] = useState({
    visitorName: '',
    visitorEmail: '',
    visitorPhone: '',
    hostName: '',
    purpose: '',
    companyName: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [recentCheckIns] = useState([
    { id: 1, name: 'John Doe', host: 'Rajesh Kumar', time: '10:30 AM', purpose: 'Meeting' },
    { id: 2, name: 'Jane Smith', host: 'Priya Sharma', time: '09:45 AM', purpose: 'Interview' },
    { id: 3, name: 'Mike Johnson', host: 'Amit Patel', time: '08:15 AM', purpose: 'Business' },
  ]);

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

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const newErrors = validateForm();

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast('Check-in successful! Welcome.', 'success');
      setFormData({
        visitorName: '',
        visitorEmail: '',
        visitorPhone: '',
        hostName: '',
        purpose: '',
        companyName: '',
      });
      setIsSubmitting(false);
    },
    [showToast],
  );

  return (
    <>
      <Breadcrumb />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Visitor Check-in at {location.name}
            </h1>
            <p className="text-slate-600">Complete the form below to check in</p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
                <div className="space-y-6">
                  {/* Visitor Information */}
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

                  {/* Visit Details */}
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
                          {locationEmployees.map((emp) => (
                            <option key={emp.id} value={emp.name}>
                              {emp.name} ({emp.department})
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

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    className="w-full"
                  >
                    {isSubmitting ? 'Checking in...' : 'Complete Check-in'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* QR Code Card */}
              <QRCard location={location} />

              {/* Stats */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4">Today's Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Visitors Checked In</span>
                    <span className="font-bold text-red-600 text-lg">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Currently Present</span>
                    <span className="font-bold text-blue-600 text-lg">8</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <p className="text-xs text-slate-500">Location Capacity: {location.capacity}</p>
                  </div>
                </div>
              </div>

              {/* Recent Check-ins */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 max-h-80 overflow-y-auto">
                <h3 className="font-bold text-slate-900 mb-4">Recent Check-ins</h3>
                <div className="space-y-3">
                  {recentCheckIns.map((checkIn) => (
                    <div key={checkIn.id} className="pb-3 border-b border-gray-200 last:border-0 text-xs">
                      <p className="font-semibold text-slate-900">{checkIn.name}</p>
                      <p className="text-slate-600">Host: {checkIn.host}</p>
                      <p className="text-slate-500">{checkIn.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
