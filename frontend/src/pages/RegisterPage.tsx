import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Bus } from 'lucide-react';
import { authApi } from '../api/endpoints';
import { useAuth } from '../features/auth/useAuth';
import { BRAND } from '../config/brand';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await authApi.register({
        firstName,
        lastName,
        email,
        phone,
        password,
        role: UserRole.PASSENGER,
      });

      login(res.user, res.accessToken);
      navigate('/passenger');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-2xl font-black text-brand-dark tracking-tight">Create your passenger account</h2>
        <p className="mt-1 text-xs text-brand-textMuted">
          Book bus seats, manage digital boarding passes, and view payment records
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Abebe"
                  className="w-full px-3 py-2.5 rounded-input text-sm border border-gray-200 focus:outline-none focus:border-brand-emerald"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Bikila"
                  className="w-full px-3 py-2.5 rounded-input text-sm border border-gray-200 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-input text-sm border border-gray-200 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                Phone Number (Ethiopian format)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0911234567 or +251911234567"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-input text-sm border border-gray-200 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <button
              type="submit"
              id="register-submit-btn"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-btn bg-brand-emerald hover:bg-brand-deep disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition-all"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-brand-textMuted">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-emerald hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
