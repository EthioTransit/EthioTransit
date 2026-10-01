import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bus, Menu, X, User, Ticket, LogOut, LayoutDashboard, Shield, Navigation } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '../../features/auth/useAuth';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { t } = useTranslation(['navigation', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: t('navigation:home') },
    { to: '/search', label: t('navigation:searchTrips') },
    { to: '/my-bookings', label: t('navigation:myBookings') },
    { to: '/my-tickets', label: t('navigation:myTickets') },
    { to: '/routes', label: t('navigation:routes') },
    { to: '/how-it-works', label: t('navigation:howItWorks') },
  ];

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) return '/admin';
    if (user.role === UserRole.OPERATOR) return '/operator';
    if (user.role === UserRole.DRIVER) return '/driver';
    return '/passenger';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-btn bg-gradient-to-br from-brand-deep to-brand-emerald flex items-center justify-center text-white shadow-md shadow-brand-emerald/20 group-hover:scale-105 transition-transform duration-200">
              <Bus className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-2xl tracking-tight text-brand-dark">
                  {BRAND.name.slice(0, 5)}
                </span>
                <span className="font-extrabold text-2xl tracking-tight text-brand-emerald">
                  {BRAND.name.slice(5)}
                </span>
                <span className="w-2 h-2 rounded-full bg-brand-gold ml-0.5"></span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-textMuted -mt-1">
                Ethiopian Mobility
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 rounded-btn text-sm font-medium transition-all duration-150 ${
                  isActive(link.to)
                    ? 'text-brand-emerald bg-emerald-50/80 font-semibold shadow-xs'
                    : 'text-brand-textMuted hover:text-brand-textMain hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Controls (Language & Auth) */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-2 px-4 py-2 rounded-btn text-sm font-semibold bg-gray-100 text-brand-textMain hover:bg-gray-200 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-emerald" />
                  <span>
                    {user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
                      ? t('navigation:admin')
                      : user.role === UserRole.OPERATOR
                      ? t('navigation:operator')
                      : user.role === UserRole.DRIVER
                      ? t('navigation:driver')
                      : t('navigation:dashboard')}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title={t('navigation:logout')}
                  className="p-2 rounded-btn text-brand-textMuted hover:text-status-error hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-brand-textMain hover:text-brand-emerald transition-colors"
                >
                  {t('navigation:login')}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-btn text-sm font-semibold text-white bg-brand-emerald hover:bg-brand-deep shadow-md shadow-brand-emerald/20 hover:shadow-lg transition-all"
                >
                  {t('navigation:signUp')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions: Language & Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-btn text-brand-textMain hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Requirement 53) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-white border-b border-gray-200 shadow-2xl p-6 z-50 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-btn text-base font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-emerald-50 text-brand-emerald font-semibold'
                    : 'text-brand-textMain hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-3 border-t border-gray-100 pt-3">
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-4 py-2 text-xs font-semibold text-brand-textLight uppercase tracking-wider">
                    Logged in as {user.firstName} ({user.role})
                  </div>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-btn bg-emerald-50 text-brand-emerald font-semibold"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Open Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 rounded-btn text-status-error hover:bg-red-50 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('navigation:logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-btn text-brand-textMain font-semibold border border-gray-200 hover:bg-gray-50"
                  >
                    {t('navigation:login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-btn text-white bg-brand-emerald font-semibold shadow-md"
                  >
                    {t('navigation:signUp')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
