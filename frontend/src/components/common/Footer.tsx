import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, ShieldCheck, QrCode, CreditCard, Phone, Mail, MapPin } from 'lucide-react';
import { BRAND } from '../../config/brand';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white border-t border-gray-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-btn bg-brand-emerald flex items-center justify-center text-white shadow-md">
                <Bus className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                {BRAND.name}
              </span>
            </div>
            <p className="text-sm text-brand-textLight max-w-sm leading-relaxed">
              Ethiopia’s next-generation intercity transportation platform connecting passengers with licensed bus operators, transparent fares, digital QR tickets, and verified seat bookings nationwide.
            </p>
            <div className="flex flex-col gap-2 mt-2 text-xs text-brand-textLight">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>Bole Medhanialem, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold" />
                <span>{BRAND.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold" />
                <span>{BRAND.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Passengers */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold">Passengers</h4>
            <ul className="flex flex-col gap-2 text-sm text-brand-textLight">
              <li>
                <Link to="/search" className="hover:text-white transition-colors">Search Trips</Link>
              </li>
              <li>
                <Link to="/routes" className="hover:text-white transition-colors">Intercity Routes</Link>
              </li>
              <li>
                <Link to="/my-tickets" className="hover:text-white transition-colors">My Digital Tickets</Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-white transition-colors">Booking History</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Operators & Drivers */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold">Operators & Staff</h4>
            <ul className="flex flex-col gap-2 text-sm text-brand-textLight">
              <li>
                <Link to="/operator" className="hover:text-white transition-colors">Operator Dashboard</Link>
              </li>
              <li>
                <Link to="/driver" className="hover:text-white transition-colors">Driver Verification Terminal</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">Platform Administration</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Staff Login</Link>
              </li>
            </ul>
          </div>

          {/* Security & Payments */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold">Trust & Payments</h4>
            <div className="flex flex-col gap-2.5 text-xs text-brand-textLight">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                <span>Server-Verified Official Fares</span>
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-brand-emerald" />
                <span>Tamper-Proof QR Boarding</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-emerald" />
                <span>Telebirr & CBE Birr Integrated</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-800">
              <span className="text-[11px] text-gray-400">Supported official payments:</span>
              <div className="flex items-center gap-2 mt-1.5 text-xs font-semibold text-gray-300">
                <span className="px-2 py-1 bg-gray-800/80 rounded border border-gray-700">Telebirr</span>
                <span className="px-2 py-1 bg-gray-800/80 rounded border border-gray-700">CBE Birr</span>
                <span className="px-2 py-1 bg-gray-800/80 rounded border border-gray-700">Chapa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-textLight gap-4">
          <p>© {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Official Ethiopian Intercity Transit Engine</span>
            <span className="text-brand-gold">★ Addis Ababa, Ethiopia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
