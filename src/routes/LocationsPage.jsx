import { useState, useCallback, useMemo } from 'react';
import { useVMS } from '../context/VMSContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import QRCard from '../components/QRCard';
import Breadcrumb from '../components/Breadcrumb';

export default function LocationsPage() {
  const { locations, addLocation, updateLocation, deleteLocation } = useVMS();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    capacity: '',
  });

  const [errors, setErrors] = useState({});

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [locations, searchTerm]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
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

      try {
        if (editingId) {
          await updateLocation(editingId, {
            ...formData,
            country: 'India',
            capacity: parseInt(formData.capacity, 10),
          });
          showToast('Location updated successfully!', 'success');
          setEditingId(null);
        } else {
          await addLocation({
            ...formData,
            country: 'India',
            capacity: parseInt(formData.capacity, 10),
          });
          showToast('Location added successfully!', 'success');
        }

        setFormData({ name: '', address: '', city: '', capacity: '' });
        setShowForm(false);
      } catch (error) {
        showToast(error.message || 'Unable to save location right now.', 'error');
      }
    },
    [formData, editingId, addLocation, updateLocation, showToast],
  );

  const handleEdit = useCallback((location) => {
    setFormData({
      name: location.name,
      address: location.address,
      city: location.city,
      capacity: location.capacity.toString(),
    });
    setEditingId(location.id);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm('Are you sure you want to delete this location?')) {
        deleteLocation(id)
          .then(() => showToast('Location deleted successfully!', 'success'))
          .catch((error) => showToast(error.message || 'Unable to delete location.', 'error'));
      }
    },
    [deleteLocation, showToast],
  );

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', address: '', city: '', capacity: '' });
    setErrors({});
  }, []);

  return (
    <>
      <Breadcrumb />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Locations</h1>
                <p className="text-slate-600">Manage office locations and QR codes</p>
              </div>
              <Button onClick={() => setShowForm(true)} variant="primary">
                + Add Location
              </Button>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingId ? 'Edit Location' : 'Add New Location'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Location Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="E.g., Mumbai Office"
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="E.g., Mumbai"
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Full office address"
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="E.g., 500"
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.capacity ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" variant="primary">
                    {editingId ? 'Update Location' : 'Add Location'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Locations Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <div key={location.id} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{location.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">📍 {location.address}</p>
                  <p className="text-slate-600 text-sm mb-4">👥 Capacity: {location.capacity}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(location)} className="flex-1">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(location.id)} className="flex-1">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                {locations.length === 0 ? 'No locations yet. Create one to get started!' : 'No locations match your search.'}
              </p>
            </div>
          )}

          {/* QR Codes Section */}
          {filteredLocations.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">QR Codes</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocations.map((location) => (
                  <QRCard key={location.id} location={location} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
