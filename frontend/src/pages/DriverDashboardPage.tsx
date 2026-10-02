import React, { useState, useEffect } from 'react';
import { Bus, QrCode, Users, CheckCircle, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../api/client';
import { BoardingScanner } from '../features/tickets/BoardingScanner';
import { PassengerManifestModal } from '../features/dashboard/PassengerManifestModal';
import { useAuth } from '../features/auth/useAuth';
import { Trip } from '../types';

export const DriverDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedManifestTripId, setSelectedManifestTripId] = useState<string | null>(null);

  const fetchDriverData = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<any>('/drivers/my/dashboard');
      setDashboard(data);
    } catch (err) {
      console.error('Failed to load driver dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

  return (
    <div className="bg-brand-bg min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-emerald uppercase tracking-wider">
              <span>Driver Handheld & Terminal Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight mt-0.5">
              Assigned Trips & QR Boarding
            </h1>
            <p className="text-xs text-brand-textMuted mt-1">
              Welcome, Captain {dashboard?.driver?.name || user?.firstName || 'Abebe Bikila'} (
              {dashboard?.driver?.licenseNumber || 'DRV-ETH-98721'})
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-card border border-emerald-100 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-emerald" />
            <div className="text-xs">
              <span className="font-extrabold text-brand-dark block">Official Fare Regulated</span>
              <span className="text-brand-textMuted">Driver cannot modify official ticket amounts</span>
            </div>
          </div>
        </div>

        {/* Boarding Scanner Tool (Requirement 37 & 38) */}
        <div className="mb-8">
          <BoardingScanner
            tripId={dashboard?.todayTrips?.[0]?._id}
            onSuccessVerification={() => fetchDriverData()}
          />
        </div>

        {/* Today's Assigned Trips */}
        <div className="bg-white rounded-card border border-gray-100 shadow-card p-6 mb-8">
          <h3 className="font-extrabold text-lg text-brand-dark mb-4">
            Today's Assigned Departures
          </h3>

          {!dashboard?.todayTrips || dashboard.todayTrips.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-card">
              No more scheduled departures assigned for today. Check upcoming trips below.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {dashboard.todayTrips.map((trip: any) => (
                <div
                  key={trip._id}
                  className="p-5 rounded-card bg-emerald-50/30 border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-gray-200">
                        {trip.tripCode}
                      </span>
                      <span className="text-xs font-semibold text-brand-emerald">
                        Plate: {trip.vehicle?.plateNumber}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-brand-dark">
                      {trip.route?.origin?.name} → {trip.route?.destination?.name}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-brand-textMuted">
                      <span>Departure: {trip.departureTime}</span>
                      <span>Pickup: {trip.pickupLocation}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedManifestTripId(trip._id)}
                      className="px-5 py-2.5 rounded-btn bg-brand-emerald text-white text-xs font-bold shadow-md hover:bg-brand-deep transition-all flex items-center gap-1.5"
                    >
                      <Users className="w-4 h-4" />
                      <span>View Passenger Manifest</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Trips Table */}
        <div className="bg-white rounded-card border border-gray-100 shadow-card p-6">
          <h3 className="font-extrabold text-base text-brand-dark mb-4">Upcoming Trips Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-brand-textMuted uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Departure</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Bus Plate</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(dashboard?.upcomingTrips || []).map((t: any) => (
                  <tr key={t._id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-bold">{t.departureDate}</td>
                    <td className="py-3.5 px-4 font-semibold text-brand-emerald">{t.departureTime}</td>
                    <td className="py-3.5 px-4 font-bold text-brand-textMain">
                      {t.route?.origin?.name} → {t.route?.destination?.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-500">{t.vehicle?.plateNumber}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedManifestTripId(t._id)}
                        className="px-3 py-1 rounded-btn bg-gray-100 text-brand-textMain hover:bg-gray-200 text-xs font-semibold"
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

      <PassengerManifestModal
        tripId={selectedManifestTripId}
        isOpen={!!selectedManifestTripId}
        onClose={() => setSelectedManifestTripId(null)}
      />
    </div>
  );
};
