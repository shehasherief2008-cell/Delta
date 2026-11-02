import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  badge?: string;
  colorScheme?: 'green' | 'mint' | 'coral' | 'forest';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  badge,
  colorScheme = 'green',
}) => {
  const getIconWrapper = () => {
    switch (colorScheme) {
      case 'mint':
        return 'bg-mint text-forest-dark';
      case 'coral':
        return 'bg-coral-light text-coral-dark';
      case 'forest':
        return 'bg-forest text-mint';
      case 'green':
      default:
        return 'bg-primary-subtle text-primary';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-sand-border shadow-soft hover:shadow-card transition-all">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-forest mt-1.5 tracking-tight">
            {value}
          </div>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getIconWrapper()}`}>
          {icon}
        </div>
      </div>
      {(subtitle || trend || badge) && (
        <div className="mt-3.5 pt-3 border-t border-sand-subtle flex items-center justify-between text-xs">
          {subtitle && <span className="text-charcoal-muted">{subtitle}</span>}
          {trend && <span className="font-semibold text-primary">{trend}</span>}
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-sand-subtle text-charcoal text-[10px] font-semibold">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

