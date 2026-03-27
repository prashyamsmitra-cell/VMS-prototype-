import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoginHistory } from '../context/LoginHistoryContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Breadcrumb from '../components/Breadcrumb';

const PROTOTYPE_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAsAdmin } = useAuth();
  const { recordLogin } = useLoginHistory();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const fillPrototypeCredentials = useCallback(() => {
    setFormData(PROTOTYPE_ADMIN_CREDENTIALS);
    setErrors((prev) => ({ ...prev, username: '', password: '', submit: '' }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
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

      setIsLoading(true);

      try {
        const admin = await loginAsAdmin(formData.username, formData.password);
        await recordLogin('admin', admin.username);
        showToast(`Welcome back, ${admin.username}!`, 'success');
        navigate('/admin');
      } catch (error) {
        setErrors({ submit: 'Invalid username or password' });
        showToast('Invalid credentials', 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [formData, loginAsAdmin, recordLogin, showToast, navigate],
  );

  return (
    <>
      <Breadcrumb />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-2">
              🔐
            </h1>
            <h2 className="text-2xl font-bold text-slate-900">Admin Portal</h2>
            <p className="text-slate-600 text-sm mt-2">Sign in to your account</p>
          </div>

          {/* Demo Credentials Info */}
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6 text-sm text-blue-900">
            <p className="font-semibold mb-2">Prototype Admin Access</p>
            <p className="mb-1">
              User ID: <span className="font-mono font-semibold">{PROTOTYPE_ADMIN_CREDENTIALS.username}</span>
            </p>
            <p className="mb-3">
              Password: <span className="font-mono font-semibold">{PROTOTYPE_ADMIN_CREDENTIALS.password}</span>
            </p>
            <button
              type="button"
              onClick={fillPrototypeCredentials}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2"
            >
              Fill these credentials automatically
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.submit && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
                {errors.submit}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              variant="secondary"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account? <span className="text-slate-900 font-semibold">Contact support</span>
          </p>
        </div>
      </div>
    </>
  );
}
