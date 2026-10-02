import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users, ShieldCheck, Wifi, Wind, Zap } from 'lucide-react';
import { Trip } from '../../types';
import { BRAND } from '../../config/brand';

interface TripCardProps {
  trip: Trip;
  travelDate: string;
  passengersCount: number;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, travelDate, passengersCount }) => {
  const originCity = trip.route?.origin?.name || 'Origin';
  const destCity = trip.route?.destination?.name || 'Destination';
  const operatorName = trip.operator?.name || 'Licensed Operator';
  const vehicleName = trip.vehicle?.vehicleModel || trip.vehicle?.vehicleType || 'Intercity Coach';

  return (
    <div className="bg-white rounded-card p-6 border border-gray-100 shadow-card hover:shadow-cardHover hover:border-emerald-200 transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group">
      {/* Left Details */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Operator & Type header */}
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-brand-emerald border border-emerald-100">
            {operatorName}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-brand-textMuted">
            {vehicleName}
          </span>
          {trip.vehicle?.plateNumber && (
            <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
              {trip.vehicle.plateNumber}
            </span>
          )}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 ml-auto sm:ml-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Bus</span>
          </div>
        </div>

        {/* Schedule & Route Timeline */}
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Departure */}
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-brand-dark">
              {trip.departureTime}
            </span>
            <span className="text-sm font-bold text-brand-textMain">{originCity}</span>
            <span className="text-xs text-brand-textMuted truncate max-w-[140px]">
              {trip.pickupLocation}
            </span>
          </div>

          {/* Middle Route Line */}
          <div className="flex-1 max-w-[160px] flex flex-col items-center">
            <span className="text-[11px] font-semibold text-brand-textLight flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-emerald" />
              <span>{trip.route?.estimatedDurationHours || 3}h est.</span>
            </span>
            <div className="w-full flex items-center my-1.5">
              <div className="w-2 h-2 rounded-full border-2 border-brand-emerald bg-white" />
              <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-emerald/80 to-brand-gold" />
              <div className="w-2 h-2 rounded-full bg-brand-gold" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
              Direct Route
            </span>
          </div>

          {/* Arrival */}
          <div className="flex flex-col text-right sm:text-left">
            <span className="text-xl sm:text-2xl font-black text-brand-dark">
              {trip.estimatedArrival || 'Scheduled'}
            </span>
            <span className="text-sm font-bold text-brand-textMain">{destCity}</span>
            <span className="text-xs text-brand-textMuted truncate max-w-[140px]">
              {trip.dropOffLocation}
            </span>
          </div>
        </div>

        {/* Amenities & Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100/80 text-xs text-brand-textMuted">
          <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50/60 px-2 py-0.5 rounded">
            <Users className="w-3.5 h-3.5" />
            <span className="font-bold">{trip.availableSeatsCount}</span> seats left
          </span>
          {trip.amenities?.map((am, i) => (
            <span key={i} className="bg-gray-50 px-2 py-0.5 rounded text-gray-600">
              {am}
            </span>
          ))}
        </div>
      </div>

      {/* Right Pricing & Action */}
      <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-8 gap-4">
        <div className="text-left lg:text-right">
          <div className="flex items-center gap-1.5 lg:justify-end text-xs font-semibold text-brand-emerald">
            <span>Official Fare</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-brand-dark">
              {trip.fare}
            </span>
            <span className="text-sm font-bold text-brand-textMuted">
              {BRAND.currency}
            </span>
          </div>
          <span className="text-[11px] text-brand-textLight">Per Passenger</span>
        </div>

        <Link
          to={`/trips/${trip._id}/seats?date=${travelDate}&passengers=${passengersCount}`}
          id={`select-seat-btn-${trip._id}`}
          className="px-6 py-3 rounded-btn bg-brand-emerald hover:bg-brand-deep text-white font-extrabold text-sm shadow-md shadow-brand-emerald/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-center flex-shrink-0"
        >
          Select Seat
        </Link>
      </div>
    </div>
  );
};
