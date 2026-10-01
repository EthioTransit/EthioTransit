import React from 'react';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Operator } from '../../types';

interface FilterSidebarProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  priceMax: number;
  onPriceMaxChange: (price: number) => void;
  selectedOperator: string;
  onOperatorChange: (opId: string) => void;
  selectedVehicleType: string;
  onVehicleTypeChange: (type: string) => void;
  operators: Operator[];
  onReset: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  sortBy,
  onSortChange,
  priceMax,
  onPriceMaxChange,
  selectedOperator,
  onOperatorChange,
  selectedVehicleType,
  onVehicleTypeChange,
  operators,
  onReset,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-emerald" />
          <h3 className="font-extrabold text-base text-brand-dark">Filters & Sort</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-brand-emerald hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Sorting (Requirement 27) */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-brand-textMuted flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort By</span>
        </label>
        <div className="flex flex-col gap-1.5">
          {[
            { id: 'DEPARTURE_EARLIEST', label: 'Earliest Departure' },
            { id: 'PRICE_ASC', label: 'Lowest Official Fare' },
            { id: 'PRICE_DESC', label: 'Highest Official Fare' },
            { id: 'DEPARTURE_LATEST', label: 'Latest Departure' },
            { id: 'SEATS_AVAILABLE', label: 'Most Available Seats' },
          ].map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                sortBy === opt.id
                  ? 'bg-emerald-50 text-brand-emerald font-bold'
                  : 'text-brand-textMain hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="sortBy"
                checked={sortBy === opt.id}
                onChange={() => onSortChange(opt.id)}
                className="text-brand-emerald focus:ring-brand-emerald"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Maximum Price Filter */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-textMuted">
            Max Price
          </label>
          <span className="text-sm font-black text-brand-emerald">
            {priceMax > 0 ? `${priceMax} ETB` : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="3000"
          step="50"
          value={priceMax || 3000}
          onChange={(e) => onPriceMaxChange(parseInt(e.target.value, 10))}
          className="w-full accent-brand-emerald cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400">
          <span>100 ETB</span>
          <span>3,000 ETB</span>
        </div>
      </div>

      {/* Operator Filter */}
      {operators.length > 0 && (
        <div className="flex flex-col gap-2.5 pt-4 border-t border-gray-100">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-textMuted">
            Bus Operator
          </label>
          <select
            value={selectedOperator}
            onChange={(e) => onOperatorChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-input border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-brand-emerald"
          >
            <option value="">All Operators</option>
            {operators.map((op) => (
              <option key={op._id} value={op._id}>
                {op.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Vehicle Type */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-gray-100">
        <label className="text-xs font-bold uppercase tracking-wider text-brand-textMuted">
          Vehicle Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['', 'Coach', 'Bus', 'Minibus'].map((vt) => (
            <button
              key={vt}
              type="button"
              onClick={() => onVehicleTypeChange(vt)}
              className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                selectedVehicleType === vt
                  ? 'bg-brand-emerald text-white border-brand-emerald shadow-xs'
                  : 'bg-white text-brand-textMain border-gray-200 hover:border-gray-300'
              }`}
            >
              {vt === '' ? 'All Types' : vt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0 bg-white rounded-card p-6 border border-gray-100 shadow-card h-fit sticky top-28">
        {content}
      </div>

      {/* Mobile Modal/Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-xs">
          <div className="w-full bg-white rounded-t-cardLg p-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 shadow-2xl">
            <div className="flex justify-end mb-2">
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {content}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 rounded-btn bg-brand-emerald text-white font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
