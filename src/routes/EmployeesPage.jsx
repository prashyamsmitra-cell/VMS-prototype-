import { useState, useCallback, useMemo } from 'react';
import { useVMS } from '../context/VMSContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Breadcrumb from '../components/Breadcrumb';

export default function EmployeesPage() {
  const { employees, locations, addEmployee, updateEmployee, deleteEmployee } = useVMS();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    emailId: '',
    mobileNumber: '',
    department: '',
    locationId: '',
  });

  const [errors, setErrors] = useState({});

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [employees, searchTerm]);

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
    if (!formData.emailId.trim()) newErrors.emailId = 'Email is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Phone is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.locationId) newErrors.locationId = 'Location is required';
    return newErrors;
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const newErrors = validateForm();

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      if (editingId) {
        updateEmployee(editingId, { ...formData, locationId: parseInt(formData.locationId) });
        showToast('Employee updated successfully!', 'success');
        setEditingId(null);
      } else {
        addEmployee({ ...formData, locationId: parseInt(formData.locationId) });
        showToast('Employee added successfully!', 'success');
      }

      setFormData({ name: '', emailId: '', mobileNumber: '', department: '', locationId: '' });
      setShowForm(false);
    },
    [formData, editingId, addEmployee, updateEmployee, showToast],
  );

  const handleEdit = useCallback((employee) => {
    setFormData({
      name: employee.name,
      emailId: employee.emailId,
      mobileNumber: employee.mobileNumber,
      department: employee.department,
      locationId: employee.locationId.toString(),
    });
    setEditingId(employee.id);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm('Are you sure you want to delete this employee?')) {
        deleteEmployee(id);
        showToast('Employee deleted successfully!', 'success');
      }
    },
    [deleteEmployee, showToast],
  );

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', emailId: '', mobileNumber: '', department: '', locationId: '' });
    setErrors({});
  }, []);

  const getLocationName = useCallback(
    (locationId) => locations.find((l) => l.id === locationId)?.name || 'Unknown',
    [locations],
  );

  return (
    <>
      <Breadcrumb />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Employees</h1>
                <p className="text-slate-600">Manage staff members and assignments</p>
              </div>
              <Button onClick={() => setShowForm(true)} variant="primary">
                + Add Employee
              </Button>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingId ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="emailId"
                      value={formData.emailId}
                      onChange={handleInputChange}
                      placeholder="email@company.com"
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.emailId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.emailId && <p className="text-red-500 text-sm mt-1">{errors.emailId}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.mobileNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="E.g., Engineering"
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.department ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.department && (
                      <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Location *
                  </label>
                  <select
                    name="locationId"
                    value={formData.locationId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.locationId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a location...</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.city})
                      </option>
                    ))}
                  </select>
                  {errors.locationId && <p className="text-red-500 text-sm mt-1">{errors.locationId}</p>}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" variant="primary">
                    {editingId ? 'Update Employee' : 'Add Employee'}
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
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Department</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee, idx) => (
                    <tr key={employee.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{employee.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{employee.emailId}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{employee.mobileNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{employee.department}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{getLocationName(employee.locationId)}</td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(employee)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(employee.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">
                  {employees.length === 0 ? 'No employees yet. Add one to get started!' : 'No employees match your search.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
