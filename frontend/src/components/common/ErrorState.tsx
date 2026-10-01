import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  code?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message,
  onRetry,
  code,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/50 rounded-card border border-red-100 max-w-lg mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-red-100 text-status-error flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      {code && (
        <span className="text-[11px] font-mono uppercase bg-red-100 text-status-error px-2 py-0.5 rounded mb-4">
          Code: {code}
        </span>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
        >
          <RefreshCw className="w-4 h-4 text-brand-emerald" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
