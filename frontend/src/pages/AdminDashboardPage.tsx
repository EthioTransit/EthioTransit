import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Route as RouteIcon,
  Bus,
  Users,
  Calendar,
  CreditCard,
  FileText,
  Search,
  Plus,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { analyticsApi, citiesApi, routesApi, bookingsApi, paymentsApi } from '../api/endpoints';
import { MetricsGrid } from '../features/dashboard/MetricsGrid';
import { RevenueChart } from '../features/dashboard/RevenueChart';
import { CityManagementModal } from '../features/dashboard/CityManagementModal';
import { RouteManagementModal } from '../features/dashboard/RouteManagementModal';
import { City, Route as RouteType, Booking } from '../types';
import { BRAND } from '../config/brand';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cities' | 'routes' | 'bookings' | 'audit'>('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Global search
  const [globalQuery, setGlobalQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);

  // Modals
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [routeModalOpen, setRouteModalOpen] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsData, citiesData, routesData, bookingsData, auditData] = await Promise.all([
        analyticsApi.getAdmin().catch(() => null),
        citiesApi.search().catch(() => []),
        routesApi.getAll().catch(() => []),
        bookingsApi.getAll().catch(() => ({ bookings: [] })),
        analyticsApi.getAuditLogs().catch(() => ({ logs: [] })),
      ]);

      setAnalytics(analyticsData);
      setCities(citiesData || []);
      setRoutes(routesData || []);
      setBookings(bookingsData.bookings || []);
      setAuditLogs(auditData.logs || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleGlobalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalQuery.trim()) return;
    try {
      const res = await analyticsApi.globalSearch(globalQuery.trim());
      setSearchResults(res);
    } catch (err) {
      console.error('Global search error:', err);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Global Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-emerald uppercase tracking-wider">
              <span>Platform Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight mt-0.5">
              Super Admin Control Center
            </h1>
          </div>

          {/* Global Search Bar (Requirement 51) */}
          <form onSubmit={handleGlobalSearch} className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              id="admin-global-search-input"
              placeholder="Search bookings, tickets, passengers..."
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 rounded-input bg-white border border-gray-200 text-sm focus:outline-none focus:border-brand-emerald shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-md bg-brand-emerald text-white text-xs font-bold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Global Search Results Dropdown/Banner */}
        {searchResults && (
          <div className="mb-8 p-6 bg-white rounded-card border border-emerald-200 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-brand-dark">Search Results for "{globalQuery}"</h3>
              <button
                onClick={() => setSearchResults(null)}
                className="text-xs font-semibold text-brand-emerald hover:underline"
              >
                Clear Results
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
              <div>
                <span className="font-bold text-gray-500 uppercase">Bookings</span>
                {searchResults.bookings?.length === 0 ? (
                  <p className="text-gray-400 mt-1">None</p>
                ) : (
                  searchResults.bookings.map((b: any) => (
                    <p key={b._id} className="font-semibold text-brand-textMain mt-1">
                      {b.bookingReference} ({b.fare} {BRAND.currency})
                    </p>
                  ))
                )}
              </div>
              <div>
                <span className="font-bold text-gray-500 uppercase">Tickets</span>
                {searchResults.tickets?.length === 0 ? (
                  <p className="text-gray-400 mt-1">None</p>
                ) : (
                  searchResults.tickets.map((t: any) => (
                    <p key={t._id} className="font-semibold text-brand-textMain mt-1">
                      {t.ticketNumber} • {t.passengerName} (Seat {t.seatNumber})
                    </p>
                  ))
                )}
              </div>
              <div>
                <span className="font-bold text-gray-500 uppercase">Passengers</span>
                {searchResults.passengers?.length === 0 ? (
                  <p className="text-gray-400 mt-1">None</p>
                ) : (
                  searchResults.passengers.map((p: any) => (
                    <p key={p._id} className="font-semibold text-brand-textMain mt-1">
                      {p.firstName} {p.lastName} • {p.phone}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-200/80">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: LayoutDashboard },
            { id: 'cities', label: `Cities (${cities.length})`, icon: Building2 },
            { id: 'routes', label: `Routes (${routes.length})`, icon: RouteIcon },
            { id: 'bookings', label: `Bookings (${bookings.length})`, icon: Calendar },
            { id: 'audit', label: 'Audit Logs', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-btn text-xs font-bold transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-brand-emerald text-white shadow-md shadow-brand-emerald/20'
                    : 'bg-white text-brand-textMuted hover:text-brand-textMain border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8">
            <MetricsGrid
              metrics={{
                totalRevenue: analytics?.overview?.totalRevenue || 0,
                totalBookings: analytics?.overview?.totalBookings || bookings.length,
                totalTrips: analytics?.overview?.totalTrips || 0,
                totalPassengers: analytics?.overview?.totalPassengers || 0,
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <RevenueChart data={analytics?.dailyRevenue || []} />
              </div>

              {/* Popular Routes Ranking Card */}
              <div className="lg:col-span-4 bg-white rounded-card p-6 border border-gray-100 shadow-card">
                <h3 className="font-extrabold text-base text-brand-dark mb-4">
                  Top Performing Routes
                </h3>
                <div className="flex flex-col divide-y divide-gray-100 text-xs">
                  {(analytics?.popularRoutes || []).map((r: any, i: number) => (
                    <div key={i} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 text-brand-emerald flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <span className="font-bold text-brand-textMain">{r.title}</span>
                      </div>
                      <span className="font-semibold text-brand-emerald">{r.distanceKm} km</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cities Management (Requirement 41) */}
        {activeTab === 'cities' && (
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-lg text-brand-dark">Ethiopian Cities Database</h3>
                <p className="text-xs text-brand-textMuted">
                  Dynamically managed cities available for intercity route connections.
                </p>
              </div>
              <button
                onClick={() => setCityModalOpen(true)}
                id="add-city-btn"
                className="px-4 py-2 rounded-btn bg-brand-emerald hover:bg-brand-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add City</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-brand-textMuted uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">City Name</th>
                    <th className="py-3 px-4">Amharic Name</th>
                    <th className="py-3 px-4">Region</th>
                    <th className="py-3 px-4">Primary Terminal</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cities.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-emerald">{c.code}</td>
                      <td className="py-3.5 px-4 font-bold text-brand-textMain">{c.name}</td>
                      <td className="py-3.5 px-4 font-ethiopic text-brand-textMuted">{c.amharicName || '—'}</td>
                      <td className="py-3.5 px-4 text-brand-textMuted">{c.region}</td>
                      <td className="py-3.5 px-4 text-brand-textLight">{c.terminalName || 'Main Station'}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-status-success">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Routes Management (Requirement 42) */}
        {activeTab === 'routes' && (
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-lg text-brand-dark">Active Intercity Routes</h3>
                <p className="text-xs text-brand-textMuted">
                  Create and manage nationwide bus routes without changing frontend code.
                </p>
              </div>
              <button
                onClick={() => setRouteModalOpen(true)}
                id="add-route-btn"
                className="px-4 py-2 rounded-btn bg-brand-emerald hover:bg-brand-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Route</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-brand-textMuted uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Origin</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Distance</th>
                    <th className="py-3 px-4">Est. Duration</th>
                    <th className="py-3 px-4">Pickup Terminal</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {routes.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-bold text-brand-textMain">{r.origin?.name}</td>
                      <td className="py-3.5 px-4 font-bold text-brand-textMain">{r.destination?.name}</td>
                      <td className="py-3.5 px-4 font-semibold text-brand-emerald">{r.distanceKm} km</td>
                      <td className="py-3.5 px-4 text-brand-textMuted">~{r.estimatedDurationHours} hrs</td>
                      <td className="py-3.5 px-4 text-brand-textLight">{r.pickupPoints?.[0]?.name || 'Central'}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-status-success">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6">
            <h3 className="font-extrabold text-lg text-brand-dark mb-4">Platform Booking Records</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-brand-textMuted uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Passenger / User</th>
                    <th className="py-3 px-4">Seats</th>
                    <th className="py-3 px-4">Official Fare</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">{b.bookingReference}</td>
                      <td className="py-3.5 px-4 font-semibold text-brand-textMain">
                        {b.passengers?.[0]?.name || b.user?.firstName || 'Guest'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-emerald">{b.seats.join(', ')}</td>
                      <td className="py-3.5 px-4 font-semibold">{b.fare} {BRAND.currency}</td>
                      <td className="py-3.5 px-4 font-bold text-brand-dark">{b.total} {BRAND.currency}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-50 text-status-success'
                              : b.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-status-error'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Immutable Audit Logs (Requirement 48) */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-card border border-gray-100 shadow-card p-6">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
              <ShieldAlert className="w-5 h-5 text-brand-gold" />
              <div>
                <h3 className="font-extrabold text-lg text-brand-dark">Immutable System Audit Logs</h3>
                <p className="text-xs text-brand-textMuted">
                  Tamper-proof chronological trail of administrative, fare, and boarding actions.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-brand-textMuted uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Resource</th>
                    <th className="py-3 px-4">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-4 text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-brand-dark">{log.action}</td>
                      <td className="py-2.5 px-4 text-brand-emerald">{log.role}</td>
                      <td className="py-2.5 px-4 text-gray-600">{log.resource}</td>
                      <td className="py-2.5 px-4 text-gray-500">{log.userEmail || log.user || 'System'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CityManagementModal
        isOpen={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        onCityCreated={loadDashboardData}
      />
      <RouteManagementModal
        isOpen={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        onRouteCreated={loadDashboardData}
        cities={cities}
      />
    </div>
  );
};
