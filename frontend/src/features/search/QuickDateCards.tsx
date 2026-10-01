import React from 'react';
import { Calendar } from 'lucide-react';

interface QuickDateCardsProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export const QuickDateCards: React.FC<QuickDateCardsProps> = ({ selectedDate, onSelectDate }) => {
  // Dynamically calculate the next 6 days starting from today
  const today = new Date();
  const days = Array.from({ length: 6 }).map((_, index) => {
    const d = new Date(today);
    d.setDate(d.getDate() + index);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const isoString = `${year}-${month}-${day}`;

    const monthShort = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const dayName =
      index === 0
        ? 'Today'
        : index === 1
        ? 'Tomorrow'
        : d.toLocaleString('en-US', { weekday: 'short' });

    return {
      iso: isoString,
      dayNum: day,
      month: monthShort,
      label: dayName,
    };
  });

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {days.map((item) => {
        const isSelected = selectedDate === item.iso;
        return (
          <button
            key={item.iso}
            type="button"
            id={`quick-date-${item.iso}`}
            onClick={() => onSelectDate(item.iso)}
            className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[76px] py-2 px-3 rounded-btn border text-center transition-all duration-150 ${
              isSelected
                ? 'bg-brand-emerald text-white border-brand-emerald shadow-md shadow-brand-emerald/20 font-bold scale-[1.02]'
                : 'bg-white text-brand-textMain border-gray-200 hover:border-brand-emerald/50 hover:bg-emerald-50/40'
            }`}
          >
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                isSelected ? 'text-emerald-100' : 'text-brand-textMuted'
              }`}
            >
              {item.label}
            </span>
            <span className="text-base font-extrabold leading-tight">{item.dayNum}</span>
            <span
              className={`text-[10px] font-medium tracking-wider ${
                isSelected ? 'text-white/80' : 'text-brand-textLight'
              }`}
            >
              {item.month}
            </span>
          </button>
        );
      })}
    </div>
  );
};
