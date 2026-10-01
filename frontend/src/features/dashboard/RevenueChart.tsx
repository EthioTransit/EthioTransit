import React from 'react';
import { BRAND } from '../../config/brand';

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1000);

  return (
    <div className="bg-white rounded-card p-6 border border-gray-100 shadow-card flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="font-extrabold text-base text-brand-dark">Revenue Trends (Last 7 Days)</h3>
          <p className="text-xs text-brand-textMuted">Verified official fare collections</p>
        </div>
        <span className="text-xs font-bold text-brand-emerald bg-emerald-50 px-2.5 py-1 rounded-full">
          Daily Total
        </span>
      </div>

      <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-2">
        {data.map((item, index) => {
          const heightPercent = Math.max(8, Math.round((item.revenue / maxRevenue) * 100));

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
              {/* Tooltip value */}
              <span className="text-[10px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.revenue}
              </span>

              {/* Bar */}
              <div className="w-full bg-gray-100 rounded-t-md h-full flex items-end overflow-hidden">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-brand-deep to-brand-emerald rounded-t-md group-hover:brightness-110 transition-all duration-300"
                />
              </div>

              {/* Date label */}
              <span className="text-[10px] font-semibold text-brand-textMuted">
                {item.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
