import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Route as RouteIcon, Search, ArrowRight, Clock, MapPin, Bus } from 'lucide-react';
import { routesApi } from '../api/endpoints';
import { Route } from '../types';

export const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const data = await routesApi.getAll();
        setRoutes(data);
      } catch (err) {
        console.error('Failed to load routes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const filtered = routes.filter(
    (r) =>
      r.origin?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.destination?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.origin?.region?.toLowerCase().includes(search.toLowerCase()) ||
      r.destination?.region?.toLowerCase().includes(search.toLowerCase())
  );

  const todayIso = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-brand-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
              Nationwide Network
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight mt-1">
              Ethiopian Intercity Routes
            </h1>
            <p className="text-sm text-brand-textMuted mt-1">
              Explore dynamic intercity routes operated by certified transportation companies.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search route by city or region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-input bg-white border border-gray-200 text-sm focus:outline-none focus:border-brand-emerald"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 bg-white rounded-card animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-card border border-gray-100">
            <p className="text-sm font-bold text-gray-500">No routes matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((route) => {
              const origin = route.origin?.name || 'Origin';
              const dest = route.destination?.name || 'Destination';

              return (
                <div
                  key={route._id}
                  className="bg-white rounded-card p-6 border border-gray-100 shadow-card hover:shadow-cardHover hover:border-emerald-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                      <span className="text-xs font-bold text-brand-emerald bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {route.origin?.region} → {route.destination?.region}
                      </span>
                      <span className="text-xs text-brand-textLight font-semibold">
                        Score {route.popularityScore}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-brand-dark">
                      {origin} → {dest}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-brand-textMuted mt-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-emerald" />
                        {route.distanceKm} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-emerald" />
                        ~{route.estimatedDurationHours} hours
                      </span>
                    </div>

                    {route.pickupPoints && route.pickupPoints.length > 0 && (
                      <p className="text-[11px] text-gray-400 mt-2 truncate">
                        Departure: {route.pickupPoints[0].name}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-emerald">Daily Departures</span>
                    <Link
                      to={`/search?from=${route.origin?.code}&to=${route.destination?.code}&date=${todayIso}&passengers=1`}
                      className="px-4 py-2 rounded-btn bg-brand-emerald hover:bg-brand-deep text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                    >
                      <span>Find Trips</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
