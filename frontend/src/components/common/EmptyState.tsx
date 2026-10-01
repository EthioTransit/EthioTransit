import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-card border border-gray-100 shadow-sm max-w-lg mx-auto my-6">
      <div className="w-14 h-14 rounded-full bg-emerald-50 text-brand-emerald flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-brand-textMain mb-1.5">{title}</h3>
      <p className="text-sm text-brand-textMuted max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-btn bg-brand-emerald text-white text-sm font-semibold hover:bg-brand-deep transition-all shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
