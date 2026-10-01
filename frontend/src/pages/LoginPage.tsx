import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Bus, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { authApi } from '../api/endpoints';
import { useAuth } from '../features/auth/useAuth';
import { BRAND } from '../config/brand';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login({ email, password });
      login(res.user, res.accessToken);

      // Role-based redirection
      if (res.user.role === UserRole.SUPER_ADMIN || res.user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else if (res.user.role === UserRole.OPERATOR) {
        navigate('/operator');
      } else if (res.user.role === UserRole.DRIVER) {
        navigate('/driver');
      } else {
        navigate('/passenger');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('EthioTransit@2026');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-btn bg-brand-emerald text-white flex items-center justify-center shadow-md">
            <Bus className="w-5 h-5" />
          </div>
          <span className="font-black text-2xl text-brand-dark tracking-tight">{BRAND.name}</span>
        </Link>
        <h2 className="text-2xl font-black text-brand-dark tracking-tight">Sign in to your account</h2>
        <p className="mt-1 text-xs text-brand-textMuted">
          Access your bookings, digital tickets, or operator/driver portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-cardLg border border-gray-100 sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-btn bg-red-50 border border-red-200 text-status-error text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  id="login-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-input text-sm border border-gray-200 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  id="login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-input text-sm border border-gray-200 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-btn bg-brand-emerald hover:bg-brand-deep disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-textLight block mb-3 text-center">
              Quick One-Click Demo Role Accounts:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@ethiotransit.et')}
                className="p-2 rounded-btn bg-gray-50 hover:bg-emerald-50 text-brand-textMain hover:text-brand-emerald font-semibold border border-gray-200 transition-colors text-left"
              >
                👑 Admin Portal
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('selam.operator@ethiotransit.et')}
                className="p-2 rounded-btn bg-gray-50 hover:bg-emerald-50 text-brand-textMain hover:text-brand-emerald font-semibold border border-gray-200 transition-colors text-left"
              >
                🏢 Selam Operator
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('driver.abebe@ethiotransit.et')}
                className="p-2 rounded-btn bg-gray-50 hover:bg-emerald-50 text-brand-textMain hover:text-brand-emerald font-semibold border border-gray-200 transition-colors text-left"
              >
                🚌 Driver Abebe
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('passenger.almaz@ethiotransit.et')}
                className="p-2 rounded-btn bg-gray-50 hover:bg-emerald-50 text-brand-textMain hover:text-brand-emerald font-semibold border border-gray-200 transition-colors text-left"
              >
                🎫 Passenger Almaz
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Default demo password: <code className="font-mono text-gray-600">EthioTransit@2026</code>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-brand-textMuted">
            Don’t have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-emerald hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
