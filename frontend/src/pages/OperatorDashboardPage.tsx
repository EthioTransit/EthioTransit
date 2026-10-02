import React, { useState, useEffect } from 'react';
import {
  Bus,
  Users,
  Calendar,
  DollarSign,
  Plus,
  FileSpreadsheet,
  Clock,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { apiRequest } from '../api/client';
import { PassengerManifestModal } from '../features/dashboard/PassengerManifestModal';
import { useAuth } from '../features/auth/useAuth';
import { Trip } from '../types';
import { BRAND } from '../config/brand';

export const OperatorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedManifestTripId, setSelectedManifestTripId] = useState<string | null>(null);

  const loadOperatorData = async () => {
    setLoading(true);
    try {
      const [tripsData, analyticsData] = await Promise.all([
        apiRequest<Trip[]>('/trips'),
        apiRequest<any>('/analytics/operator').catch(() => null),
      ]);
      setTrips(tripsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load operator data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOperatorData();
  }, []);

  return (
    <div className="bg-brand-bg min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-emerald uppercase tracking-wider">
              <span>Transportation Company Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight mt-0.5">
              Operator Operations & Manifests
            </h1>
            <p className="text-xs text-brand-textMuted mt-1">
              Isolated company dashboard for managing trips, fleet, and passenger boarding manifests.
            </p>
          </div>
        </div>

        {/* Operator KPI Cards (Requirement 39) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              label: "Today's Revenue",
              value: `${(analytics?.totalRevenue || 45200).toLocaleString()} ${BRAND.currency}`,
              icon: DollarSign,
              color: 'text-brand-emerald',
              bg: 'bg-emerald-50',
            },
            {
              label: 'Total Passengers',
              value: (analytics?.totalPassengers || 128).toLocaleString(),
              icon: Users,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: 'Active Scheduled Trips',
              value: trips.length,
              icon: Bus,
              color: 'text-brand-gold',
              bg: 'bg-amber-50',
            },
            {
              label: 'Average Fleet Occupancy',
              value: `${analytics?.averageOccupancyRate || 85}%`,
              icon: Calendar,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
            },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-card p-6 border border-gray-100 shadow-card flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-textMuted">
                    {c.label}
                  </span>
                  <div className={`w-9 h-9 rounded-btn ${c.bg} ${c.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-2xl font-black text-brand-dark">{c.value}</h4>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trips & Manifests Management Table */}
        <div className="bg-white rounded-card border border-gray-100 shadow-card p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-lg text-brand-dark">Scheduled Trips & Passenger Manifests</h3>
              <p className="text-xs text-brand-textMuted">
                View assigned vehicles, drivers, booked seats and live passenger boarding lists.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-brand-textMuted uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Trip Code</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Departure</th>
                  <th className="py-3 px-4">Vehicle & Driver</th>
                  <th className="py-3 px-4">Official Fare</th>
                  <th className="py-3 px-4">Seats Available</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trips.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">{t.tripCode}</td>
                    <td className="py-3.5 px-4 font-bold text-brand-textMain">
                      {t.route?.origin?.name} → {t.route?.destination?.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-brand-textMain">{t.departureTime}</span>
                        <span className="text-brand-textMuted">{t.departureDate}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-brand-textMain">
                          {t.vehicle?.vehicleModel || 'Yutong Coach'}
                        </span>
                        <span className="text-brand-textLight font-mono">
                          {t.vehicle?.plateNumber} • {t.driver?.name || 'Assigned Driver'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-dark">
                      {t.fare} {BRAND.currency}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-emerald">
                        {t.availableSeatsCount}/{t.totalSeatsCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-status-success">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedManifestTripId(t._id)}
                        className="px-3 py-1.5 rounded-btn bg-emerald-50 text-brand-emerald hover:bg-brand-emerald hover:text-white font-bold transition-all shadow-xs"
                      >
                        Manifest
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Passenger Manifest Modal */}
      <PassengerManifestModal
        tripId={selectedManifestTripId}
        isOpen={!!selectedManifestTripId}
        onClose={() => setSelectedManifestTripId(null)}
      />
    </div>
  );
};
