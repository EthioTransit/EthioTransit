import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ArrowUpDown, Calendar, Users, MapPin, RefreshCw, Bus } from 'lucide-react';
import { tripsApi, citiesApi, operatorsApi } from '../api/endpoints';
import { TripCard } from '../features/search/TripCard';
import { FilterSidebar } from '../features/search/FilterSidebar';
import { TripCardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Trip, Operator, City } from '../types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const fromParam = searchParams.get('from') || 'ADD';
  const toParam = searchParams.get('to') || 'DBR';
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const passengersParam = parseInt(searchParams.get('passengers') || '1', 10);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originCity, setOriginCity] = useState<City | null>(null);
  const [destCity, setDestCity] = useState<City | null>(null);
  const [operators, setOperators] = useState<Operator[]>([]);

  // Filter & Sort State
  const [sortBy, setSortBy] = useState('DEPARTURE_EARLIEST');
  const [priceMax, setPriceMax] = useState(0);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchSearchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tripsApi.search({
        from: fromParam,
        to: toParam,
        date: dateParam,
        passengers: passengersParam,
        priceMax: priceMax > 0 ? priceMax : undefined,
        operatorId: selectedOperator || undefined,
        vehicleType: selectedVehicleType || undefined,
        sortBy,
      });

      setTrips(res.trips);
      if (res.originCity) setOriginCity(res.originCity);
      if (res.destinationCity) setDestCity(res.destinationCity);
    } catch (err: any) {
      setError(err.message || 'Failed to search available trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [fromParam, toParam, dateParam, passengersParam, sortBy, priceMax, selectedOperator, selectedVehicleType]);

  const handleResetFilters = () => {
    setSortBy('DEPARTURE_EARLIEST');
    setPriceMax(0);
    setSelectedOperator('');
    setSelectedVehicleType('');
  };

  return (
    <div className="bg-brand-bg min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header Banner */}
        <div className="bg-white rounded-card p-6 md:p-8 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-emerald">
              <span>Ethiopian Intercity Route</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
              {originCity?.name || fromParam} → {destCity?.name || toParam}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-brand-textMuted mt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-emerald" />
                {dateParam}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-emerald" />
                {passengersParam} {passengersParam === 1 ? 'Passenger' : 'Passengers'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-btn bg-gray-100 hover:bg-gray-200 text-brand-textMain text-xs font-bold transition-colors"
            >
              Modify Search
            </Link>
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-btn bg-brand-emerald text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Content Layout: Filter Sidebar + Trips List */}
        <div className="flex items-start gap-8">
          <FilterSidebar
            sortBy={sortBy}
            onSortChange={setSortBy}
            priceMax={priceMax}
            onPriceMaxChange={setPriceMax}
            selectedOperator={selectedOperator}
            onOperatorChange={setSelectedOperator}
            selectedVehicleType={selectedVehicleType}
            onVehicleTypeChange={setSelectedVehicleType}
            operators={operators}
            onReset={handleResetFilters}
            isMobileOpen={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />

          {/* Trips List Container */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-extrabold text-brand-dark">
                {loading ? 'Searching buses...' : `${trips.length} trips available`}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col gap-4">
                <TripCardSkeleton />
                <TripCardSkeleton />
                <TripCardSkeleton />
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={fetchSearchResults} />
            ) : trips.length === 0 ? (
              <EmptyState
                icon={Bus}
                title="No Trips Found"
                description={`No scheduled departures found from ${fromParam} to ${toParam} on ${dateParam}. Try selecting a different date or origin city.`}
                actionText="Back to Homepage"
                onAction={() => window.location.assign('/')}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {trips.map((trip) => (
                  <TripCard
                    key={trip._id}
                    trip={trip}
                    travelDate={dateParam}
                    passengersCount={passengersParam}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
