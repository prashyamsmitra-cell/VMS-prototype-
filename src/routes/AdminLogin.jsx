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
        const admin = await loginAsAdmin(formData.username.trim(), formData.password);
        await recordLogin('admin', admin.username);
        showToast(`Welcome back, ${admin.username}!`, 'success');
        navigate('/admin');
      } catch (error) {
        const message = error?.message || 'Login failed. Please try again.';
        setErrors({ submit: message });
        showToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [formData, loginAsAdmin, recordLogin, showToast, navigate],
  );

  return (
    <>
      <Breadcrumb />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-10">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h2>
            <p className="text-slate-600 text-sm">Sign in to your account</p>
          </div>

          {/* Demo Credentials Info */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4 sm:p-5 mb-8 text-sm">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-lg flex-shrink-0">💡</span>
              <div>
                <p className="font-semibold text-blue-900 mb-2">Demo Credentials</p>
                <p className="text-blue-800 mb-1">
                  User ID: <span className="font-mono font-bold bg-white px-2 py-1 rounded">{PROTOTYPE_ADMIN_CREDENTIALS.username}</span>
                </p>
                <p className="text-blue-800">
                  Password: <span className="font-mono font-bold bg-white px-2 py-1 rounded">{PROTOTYPE_ADMIN_CREDENTIALS.password}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={fillPrototypeCredentials}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-all duration-250 w-full"
            >
              Auto-fill Demo Credentials
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-start gap-2">
                <span className="text-lg flex-shrink-0">⚠️</span>
                <span>{errors.submit}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="admin"
                autoComplete="username"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-250 font-medium ${
                  errors.username ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              {errors.username && <p className="text-red-500 text-xs font-semibold mt-1.5">✗ {errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-250 font-medium ${
                  errors.password ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs font-semibold mt-1.5">✗ {errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-7"
              variant="secondary"
            >
              {isLoading ? '⏳ Signing in...' : '🚀 Sign In'}
            </Button>
          </form>

          {/* Support Link */}
          <div className="text-center border-t border-gray-100 pt-6 mt-8">
            <p className="text-sm text-slate-600">
              Need help? <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
