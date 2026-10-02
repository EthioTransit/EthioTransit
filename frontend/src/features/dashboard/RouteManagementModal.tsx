import React, { useState } from 'react';
import { X, Route as RouteIcon, Plus } from 'lucide-react';
import { routesApi } from '../../api/endpoints';
import { City } from '../../types';

interface RouteManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteCreated: () => void;
  cities: City[];
}

export const RouteManagementModal: React.FC<RouteManagementModalProps> = ({
  isOpen,
  onClose,
  onRouteCreated,
  cities,
}) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distanceKm, setDistanceKm] = useState(150);
  const [estimatedDurationHours, setEstimatedDurationHours] = useState(3.0);
  const [pickupPoint, setPickupPoint] = useState('');
  const [dropOffPoint, setDropOffPoint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) {
      setError('Please select both origin and destination cities.');
      return;
    }
    if (origin === destination) {
      setError('Origin and destination cities cannot be identical.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await routesApi.create({
        origin,
        destination,
        distanceKm: Number(distanceKm),
        estimatedDurationHours: Number(estimatedDurationHours),
        pickupPoints: pickupPoint ? [{ name: pickupPoint, timeOffsetMinutes: 0 }] : undefined,
        dropOffPoints: dropOffPoint ? [{ name: dropOffPoint }] : undefined,
        status: 'ACTIVE',
      });

      onRouteCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create route.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-cardLg shadow-2xl border border-gray-100 p-6 md:p-8 w-full max-w-lg animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <RouteIcon className="w-5 h-5 text-brand-emerald" />
            <h3 className="font-extrabold text-lg text-brand-dark">Create New Intercity Route</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-btn bg-red-50 border border-red-200 text-status-error text-xs mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                Origin City *
              </label>
              <select
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-input border border-gray-200 focus:outline-none focus:border-brand-emerald bg-white"
              >
                <option value="">Select departure city</option>
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                Destination City *
              </label>
              <select
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-input border border-gray-200 focus:outline-none focus:border-brand-emerald bg-white"
              >
                <option value="">Select arrival city</option>
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                Distance (KM) *
              </label>
              <input
                type="number"
                required
                min={10}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-input border border-gray-200 focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                Estimated Duration (Hours) *
              </label>
              <input
                type="number"
                step="0.5"
                required
                min={0.5}
                value={estimatedDurationHours}
                onChange={(e) => setEstimatedDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-input border border-gray-200 focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
              Primary Departure Pickup Point
            </label>
            <input
              type="text"
              placeholder="e.g. Autobus Tera Main Gate / Lam Beret"
              value={pickupPoint}
              onChange={(e) => setPickupPoint(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-input border border-gray-200 focus:outline-none focus:border-brand-emerald"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
              Primary Arrival Drop-off Point
            </label>
            <input
              type="text"
              placeholder="e.g. Central Bus Terminal"
              value={dropOffPoint}
              onChange={(e) => setDropOffPoint(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-input border border-gray-200 focus:outline-none focus:border-brand-emerald"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-brand-textMuted hover:bg-gray-100 rounded-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-btn bg-brand-emerald hover:bg-brand-deep text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              {loading ? 'Creating...' : 'Create Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
