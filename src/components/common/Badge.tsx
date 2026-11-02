import React from 'react';
import { DonationStatus, FoodCategory, DietaryType } from '../../types';
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  AlertTriangle, 
  Package, 
  Sparkles 
} from 'lucide-react';

interface StatusBadgeProps {
  status: DonationStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'available':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-mint text-forest-dark border border-mint-dark ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>Available</span>
        </span>
      );
    case 'claimed':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-amber-100 text-amber-900 border border-amber-300 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>Claimed</span>
        </span>
      );
    case 'pickup_scheduled':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-blue-100 text-blue-900 border border-blue-300 ${sizeClasses}`}>
          <Truck className="w-3.5 h-3.5 text-blue-700" />
          <span>Pickup Scheduled</span>
        </span>
      );
    case 'in_transit':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-purple-100 text-purple-900 border border-purple-300 ${sizeClasses}`}>
          <Truck className="w-3.5 h-3.5 text-purple-700 animate-bounce" />
          <span>In Transit</span>
        </span>
      );
    case 'delivered':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-primary-subtle text-primary border border-primary/30 ${sizeClasses}`}>
          <CheckCircle className="w-3.5 h-3.5 text-primary" />
          <span>Delivered</span>
        </span>
      );
    case 'expired':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-stone-200 text-stone-700 border border-stone-300 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>Expired</span>
        </span>
      );
    case 'cancelled':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-red-100 text-red-800 border border-red-200 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5" />
          <span>Cancelled</span>
        </span>
      );
    default:
      return null;
  }
};

export const CategoryBadge: React.FC<{ category: FoodCategory }> = ({ category }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-sand-subtle text-charcoal-muted border border-sand-border">
      <Package className="w-3 h-3 text-primary" />
      <span>{category}</span>
    </span>
  );
};

export const DietaryBadge: React.FC<{ type: DietaryType }> = ({ type }) => {
  let style = 'bg-stone-100 text-charcoal-muted border-stone-200';
  if (type === 'Vegetarian' || type === 'Vegan') {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (type === 'Halal' || type === 'Kosher') {
    style = 'bg-sky-50 text-sky-800 border-sky-200';
  } else if (type === 'Gluten-Free' || type === 'Nut-Free') {
    style = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${style}`}>
      {type}
    </span>
  );
};

