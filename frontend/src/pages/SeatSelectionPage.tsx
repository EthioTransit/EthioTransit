import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bus, Calendar, Clock, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import { tripsApi } from '../api/endpoints';
import { SeatMap } from '../features/seats/SeatMap';
import { SeatLegend } from '../features/seats/SeatLegend';
import { SeatLockTimer } from '../features/seats/SeatLockTimer';
import { useAuth } from '../features/auth/useAuth';
import { Trip, SeatItem } from '../types';
import { BRAND } from '../config/brand';

export const SeatSelectionPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { guestLockId } = useAuth();

  const passengersCount = parseInt(searchParams.get('passengers') || '1', 10);
  const travelDate = searchParams.get('date') || '';

  const [trip, setTrip] = useState<Trip | null>(null);
  const [seats, setSeats] = useState<SeatItem[]>([]);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [lockExpiresAt, setLockExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTripAndSeats = async () => {
    if (!tripId) return;
    setLoading(true);
    setError(null);
    try {
      const [tripData, seatsData] = await Promise.all([
        tripsApi.getById(tripId),
        tripsApi.getSeats(tripId, guestLockId),
      ]);

      setTrip(tripData);
      setSeats(seatsData.seats);

      // Check if any seats were already locked by this user
      const myLocked = seatsData.seats.filter((s) => s.isMine).map((s) => s.seatNumber);
      if (myLocked.length > 0) {
        setSelectedSeatNumbers(myLocked);
        const expires = seatsData.seats.find((s) => s.isMine)?.lockExpiresAt;
        if (expires) setLockExpiresAt(expires);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load seat layout.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripAndSeats();
  }, [tripId]);

  const handleToggleSeat = async (seatNumber: string) => {
    if (!tripId) return;

    setError(null);
    const isCurrentlySelected = selectedSeatNumbers.includes(seatNumber);

    if (isCurrentlySelected) {
      // Unlock seat
      const nextSelected = selectedSeatNumbers.filter((s) => s !== seatNumber);
      setSelectedSeatNumbers(nextSelected);

      try {
        await tripsApi.unlockSeats(tripId, [seatNumber], guestLockId);
        // Refresh seat statuses
        const updated = await tripsApi.getSeats(tripId, guestLockId);
        setSeats(updated.seats);
        if (nextSelected.length === 0) setLockExpiresAt(null);
      } catch (err) {
        console.error('Failed to unlock seat:', err);
      }
    } else {
      // Check maximum seats based on passengers search count
      if (selectedSeatNumbers.length >= passengersCount) {
        setError(`You searched for ${passengersCount} passenger(s). Deselect a seat before choosing another.`);
        return;
      }

      setLocking(true);
      const nextSelected = [...selectedSeatNumbers, seatNumber];

      try {
        // Atomic backend lock (10 minutes)
        const lockRes = await tripsApi.lockSeats(tripId, [seatNumber], guestLockId);
        setSelectedSeatNumbers(nextSelected);
        setLockExpiresAt(lockRes.lockExpiresAt);

        // Refresh seats
        const updated = await tripsApi.getSeats(tripId, guestLockId);
        setSeats(updated.seats);
      } catch (err: any) {
        setError(err.message || 'Seat could not be locked.');
      } finally {
        setLocking(false);
      }
    }
  };

  const handleTimerExpired = () => {
    setError('Your 10-minute seat reservation has expired. Please select your seats again.');
    setSelectedSeatNumbers([]);
    setLockExpiresAt(null);
    fetchTripAndSeats();
  };

  const handleProceedToCheckout = () => {
    if (selectedSeatNumbers.length !== passengersCount) {
      setError(`Please select exactly ${passengersCount} seat(s) before proceeding.`);
      return;
    }

    navigate(
      `/checkout?tripId=${tripId}&seats=${selectedSeatNumbers.join(',')}&date=${travelDate}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-brand-textMain">Loading bus seat map...</span>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-brand-bg p-8 text-center">
        <p className="text-red-600 font-bold">Trip not found.</p>
        <Link to="/search" className="mt-4 inline-block text-brand-emerald font-semibold">
          Return to Search
        </Link>
      </div>
    );
  }

  const fareTotal = trip.fare * selectedSeatNumbers.length;

  return (
    <div className="bg-brand-bg min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          to={`/search?from=${trip.route?.origin?.code}&to=${trip.route?.destination?.code}&date=${travelDate}&passengers=${passengersCount}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-emerald hover:text-brand-deep mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trip Results</span>
        </Link>

        {/* Trip Header Card */}
        <div className="bg-white rounded-card p-6 md:p-8 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-emerald">
              <span>{trip.operator?.name}</span>
              <span>•</span>
              <span>{trip.vehicle?.vehicleModel || trip.vehicle?.vehicleType}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
              {trip.route?.origin?.name} → {trip.route?.destination?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-brand-textMuted mt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-emerald" />
                {trip.departureDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-emerald" />
                {trip.departureTime}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-emerald" />
                {trip.pickupLocation}
              </span>
            </div>
          </div>

          <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
            <span className="text-xs text-brand-textLight font-semibold uppercase">Official Fare</span>
            <div className="flex items-baseline gap-1 md:justify-end">
              <span className="text-3xl font-black text-brand-dark">{trip.fare}</span>
              <span className="text-sm font-bold text-brand-textMuted">{BRAND.currency}</span>
            </div>
            <span className="text-[11px] text-brand-emerald font-bold">Per Seat</span>
          </div>
        </div>

        {/* Reservation Timeout Notice if seats are locked */}
        {lockExpiresAt && (
          <div className="mb-6">
            <SeatLockTimer expiresAt={lockExpiresAt} onExpire={handleTimerExpired} />
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-card bg-red-50 border border-red-200 text-status-error text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Legend */}
        <div className="mb-6">
          <SeatLegend />
        </div>

        {/* Main Seat Map & Floating Action Bar */}
        <div className="flex flex-col gap-6">
          <SeatMap
            seats={seats}
            selectedSeatNumbers={selectedSeatNumbers}
            onToggleSeat={handleToggleSeat}
            maxSelectable={passengersCount}
          />

          {/* Bottom Bar: Selection Summary */}
          <div className="bg-white rounded-card p-6 border border-gray-100 shadow-xl sticky bottom-4 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-textMuted">
                  Selected Seats:
                </span>
                <span className="text-base font-black text-brand-emerald">
                  {selectedSeatNumbers.length > 0 ? selectedSeatNumbers.join(', ') : 'None'}
                </span>
                <span className="text-xs text-brand-textLight">
                  ({selectedSeatNumbers.length}/{passengersCount} required)
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xs text-brand-textMuted font-semibold">Subtotal Official Fare:</span>
                <span className="text-lg font-black text-brand-dark ml-1">
                  {fareTotal} {BRAND.currency}
                </span>
              </div>
            </div>

            <button
              type="button"
              id="proceed-checkout-btn"
              disabled={selectedSeatNumbers.length !== passengersCount || locking}
              onClick={handleProceedToCheckout}
              className="px-8 py-3.5 rounded-btn bg-brand-emerald hover:bg-brand-deep disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-md shadow-brand-emerald/25 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Proceed to Passenger Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
