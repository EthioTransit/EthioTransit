import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { BRAND } from '../../config/brand';

interface PriceBreakdownProps {
  farePerSeat: number;
  serviceFeePerSeat: number;
  seatsCount: number;
  selectedSeats: string[];
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  farePerSeat,
  serviceFeePerSeat,
  seatsCount,
  selectedSeats,
}) => {
  const totalFare = farePerSeat * seatsCount;
  const totalServiceFee = serviceFeePerSeat * seatsCount;
  const grandTotal = totalFare + totalServiceFee;

  return (
    <div className="bg-white rounded-card p-6 border border-gray-100 shadow-card flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-extrabold text-base text-brand-dark">Price Breakdown</h3>
        <span className="text-xs font-bold text-brand-emerald bg-emerald-50 px-2.5 py-1 rounded-full">
          Transparent Pricing
        </span>
      </div>

      <div className="flex flex-col gap-2.5 text-sm">
        {/* Seats Selected */}
        <div className="flex justify-between items-center text-brand-textMuted">
          <span>Seats Selected</span>
          <span className="font-semibold text-brand-textMain">
            {selectedSeats.join(', ') || 'None'} ({seatsCount})
          </span>
        </div>

        {/* Official Fare */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-brand-textMain font-medium">
            <span>Official Fare</span>
            <span className="text-xs text-brand-textMuted">
              ({farePerSeat} {BRAND.currency} × {seatsCount})
            </span>
          </div>
          <span className="font-bold text-brand-textMain">
            {totalFare} {BRAND.currency}
          </span>
        </div>

        {/* Platform Fee */}
        <div className="flex justify-between items-center text-brand-textMuted">
          <div className="flex items-center gap-1.5">
            <span>Platform Service Fee</span>
            <span className="text-xs">
              ({serviceFeePerSeat} {BRAND.currency} × {seatsCount})
            </span>
          </div>
          <span className="font-semibold">
            {totalServiceFee} {BRAND.currency}
          </span>
        </div>

        {/* Grand Total */}
        <div className="pt-3 mt-1 border-t border-gray-100 flex justify-between items-baseline">
          <div className="flex flex-col">
            <span className="font-extrabold text-base text-brand-dark">Total Amount Due</span>
            <span className="text-[11px] text-brand-textLight">Includes all regulatory taxes & fees</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-brand-emerald">
              {grandTotal}
            </span>
            <span className="text-sm font-bold text-brand-emerald ml-1">
              {BRAND.currency}
            </span>
          </div>
        </div>
      </div>

      {/* Trust banner */}
      <div className="p-3 rounded-btn bg-emerald-50/60 border border-emerald-100 flex items-start gap-2 text-xs text-emerald-900">
        <ShieldCheck className="w-4 h-4 text-brand-emerald flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold text-brand-emerald">Official Fare Protection:</strong> Drivers cannot change or solicit extra fees. Your booking is legally protected under Ministry of Transport guidelines.
        </p>
      </div>
    </div>
  );
};
