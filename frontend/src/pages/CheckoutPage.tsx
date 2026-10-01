import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { tripsApi, bookingsApi, paymentsApi } from '../api/endpoints';
import { PassengerForm } from '../features/booking/PassengerForm';
import { PriceBreakdown } from '../features/booking/PriceBreakdown';
import { useAuth } from '../features/auth/useAuth';
import { Trip, PassengerInfo } from '../types';
import { BRAND } from '../config/brand';

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, guestLockId } = useAuth();

  const tripId = searchParams.get('tripId') || '';
  const seatsParam = searchParams.get('seats') || '';
  const selectedSeats = seatsParam ? seatsParam.split(',') : [];

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [passengers, setPassengers] = useState<PassengerInfo[]>(
    selectedSeats.map((seatNumber, i) => ({
      name: i === 0 && user ? `${user.firstName} ${user.lastName}` : '',
      phone: i === 0 && user ? user.phone : '',
      seatNumber,
      ageGroup: 'ADULT',
      idNumber: '',
    }))
  );

  const [paymentProvider, setPaymentProvider] = useState<'mock' | 'telebirr' | 'chapa' | 'cbe_birr'>('mock');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!tripId || selectedSeats.length === 0) {
      navigate('/search');
      return;
    }

    const fetchTrip = async () => {
      setLoading(true);
      try {
        const data = await tripsApi.getById(tripId);
        setTrip(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load trip details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengers];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setPassengers(updated);
    setFieldErrors((prev) => ({ ...prev, [`passenger_${index}_${field}`]: '' }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    passengers.forEach((p, idx) => {
      if (!p.name || p.name.trim().length < 2) {
        errors[`passenger_${idx}_name`] = 'Full name is required (at least 2 letters)';
      }
      const cleanPhone = p.phone.trim();
      const phoneRegex = /^(\+251|0)[79]\d{8}$/;
      if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
        errors[`passenger_${idx}_phone`] = 'Valid Ethiopian phone required (e.g. 0911234567)';
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateBookingAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !trip) return;

    setSubmitting(true);
    setError(null);

    try {
      // 1. If not authenticated, prompt user or auto sign-in with passenger 1 phone
      if (!isAuthenticated) {
        // Save state to localStorage and direct to login, or use guest token
        // To provide seamless experience, create guest session
      }

      // Create Booking
      const booking = await bookingsApi.create({
        tripId: trip._id,
        seats: selectedSeats,
        passengers,
        guestLockId,
      });

      // Initiate Payment session
      const paymentIntent = await paymentsApi.create({
        bookingId: booking._id,
        provider: paymentProvider,
        paymentMethod:
          paymentProvider === 'telebirr'
            ? 'Telebirr SuperApp'
            : paymentProvider === 'cbe_birr'
            ? 'CBE Birr Mobile'
            : paymentProvider === 'chapa'
            ? 'Chapa Gateway'
            : 'Mock Instant Birr Gateway',
      });

      // Navigate to verification page
      navigate(`/verify-payment?ref=${paymentIntent.transactionReference}&bookingId=${booking._id}`);
    } catch (err: any) {
      if (err.message && err.message.includes('Authentication required')) {
        setError('Please sign in or create an account to finalize your booking ticket.');
      } else {
        setError(err.message || 'Failed to initiate booking payment.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-brand-textMain">Loading checkout...</span>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="bg-brand-bg min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={`/trips/${tripId}/seats?seats=${seatsParam}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-emerald hover:text-brand-deep mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Selected Seats</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
            Checkout & Passenger Details
          </h1>
          <p className="text-sm text-brand-textMuted mt-1">
            Review official ticket fares and enter traveler information for digital boarding pass generation.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-card bg-red-50 border border-red-200 text-status-error text-sm font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <span>{error}</span>
              {error.includes('sign in') && (
                <Link to="/login" className="ml-2 font-bold underline text-brand-emerald">
                  Sign In Now
                </Link>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleCreateBookingAndPay} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Passenger Info & Payment Options */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <PassengerForm
              seats={selectedSeats}
              passengers={passengers}
              onChange={handlePassengerChange}
              errors={fieldErrors}
            />

            {/* Payment Method Selector (Requirement 33 & 34) */}
            <div className="bg-white rounded-card p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-extrabold text-base text-brand-dark">Choose Official Payment Provider</h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Instant Verification
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'mock',
                    title: 'Instant Sandbox Gateway',
                    desc: 'Developer & Test Instant Approval',
                    badge: 'Dev Mode',
                  },
                  {
                    id: 'telebirr',
                    title: 'Telebirr SuperApp',
                    desc: 'Ethio Telecom Mobile Money',
                    badge: 'Popular',
                  },
                  {
                    id: 'cbe_birr',
                    title: 'CBE Birr',
                    desc: 'Commercial Bank of Ethiopia',
                    badge: 'Bank Pay',
                  },
                  {
                    id: 'chapa',
                    title: 'Chapa Pay',
                    desc: 'Debit Card & Digital Wallet',
                    badge: 'Card / QR',
                  },
                ].map((prov) => (
                  <label
                    key={prov.id}
                    className={`p-4 rounded-card border-2 cursor-pointer flex flex-col justify-between transition-all ${
                      paymentProvider === prov.id
                        ? 'border-brand-emerald bg-emerald-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <input
                        type="radio"
                        name="paymentProvider"
                        value={prov.id}
                        checked={paymentProvider === prov.id}
                        onChange={() => setPaymentProvider(prov.id as any)}
                        className="text-brand-emerald focus:ring-brand-emerald mt-0.5"
                      />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-emerald bg-emerald-100/60 px-2 py-0.5 rounded">
                        {prov.badge}
                      </span>
                    </div>

                    <div className="mt-3">
                      <span className="font-extrabold text-sm text-brand-textMain block">
                        {prov.title}
                      </span>
                      <span className="text-xs text-brand-textMuted block mt-0.5">
                        {prov.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Price Breakdown & Confirmation */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
            <PriceBreakdown
              farePerSeat={trip.fare}
              serviceFeePerSeat={trip.serviceFee || BRAND.platformFee}
              seatsCount={selectedSeats.length}
              selectedSeats={selectedSeats}
            />

            <button
              type="submit"
              id="confirm-pay-btn"
              disabled={submitting}
              className="w-full py-4 rounded-btn bg-brand-emerald hover:bg-brand-deep disabled:opacity-50 text-white font-extrabold text-base shadow-lg shadow-brand-emerald/25 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              <span>{submitting ? 'Processing Payment...' : 'Pay Official Fare & Issue Tickets'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
