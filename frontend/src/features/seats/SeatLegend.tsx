import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-3 px-4 bg-gray-50/80 rounded-card border border-gray-100 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md border-2 border-gray-300 bg-white" />
        <span className="font-medium text-brand-textMain">Available</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-brand-emerald text-white flex items-center justify-center text-[10px] font-bold shadow-xs" />
        <span className="font-medium text-brand-textMain">Selected</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-amber-400 text-white flex items-center justify-center text-[10px] font-bold" />
        <span className="font-medium text-brand-textMain">Reserved (Temporary)</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-gray-300 text-gray-500 cursor-not-allowed" />
        <span className="font-medium text-brand-textMuted">Booked</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-red-200 border border-red-300 cursor-not-allowed" />
        <span className="font-medium text-brand-textMuted">Blocked</span>
      </div>
    </div>
  );
};
