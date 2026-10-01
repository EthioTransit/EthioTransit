import React from 'react';
import { TrendingUp, Users, Bus, Calendar, DollarSign, ShieldAlert } from 'lucide-react';
import { BRAND } from '../../config/brand';

interface MetricsGridProps {
  metrics: {
    totalRevenue?: number;
    totalBookings?: number;
    totalTrips?: number;
    totalPassengers?: number;
    totalVehicles?: number;
    occupancyRate?: number;
    paymentSuccessRate?: number;
  };
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const cards = [
    {
      label: 'Total Platform Revenue',
      value: `${(metrics.totalRevenue || 0).toLocaleString()} ${BRAND.currency}`,
      icon: DollarSign,
      color: 'text-brand-emerald',
      bg: 'bg-emerald-50',
      change: '+14% this month',
    },
    {
      label: 'Confirmed Bookings',
      value: (metrics.totalBookings || 0).toLocaleString(),
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      change: '100% digital records',
    },
    {
      label: 'Total Passengers Traveled',
      value: (metrics.totalPassengers || 0).toLocaleString(),
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      change: 'Verified manifest records',
    },
    {
      label: 'Active Scheduled Trips',
      value: (metrics.totalTrips || 0).toLocaleString(),
      icon: Bus,
      color: 'text-brand-gold',
      bg: 'bg-amber-50',
      change: 'Across all active routes',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-card p-6 border border-gray-100 shadow-card flex flex-col justify-between hover:shadow-cardHover transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-textMuted">
                {c.label}
              </span>
              <div className={`w-10 h-10 rounded-btn ${c.bg} ${c.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-2xl font-black text-brand-dark tracking-tight">{c.value}</h4>
              <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
                {c.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
