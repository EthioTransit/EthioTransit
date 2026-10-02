import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`animate-pulse bg-gray-200/80 rounded-md ${className}`} />;
};

export const TripCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-card p-6 border border-gray-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 animate-pulse">
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="flex items-center gap-6 mt-1">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-0.5 w-24 bg-gray-200" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="flex md:flex-col items-end justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 gap-3">
        <div className="text-right">
          <Skeleton className="h-3 w-16 mb-1 ml-auto" />
          <Skeleton className="h-8 w-28 ml-auto" />
        </div>
        <Skeleton className="h-11 w-32 rounded-btn" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
};
