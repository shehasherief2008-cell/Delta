import React from 'react';
import { FoodDonation } from '../../types';
import { StatusBadge, CategoryBadge, DietaryBadge } from '../common/Badge';
import { Link } from '../../lib/router';
import { Clock, MapPin, Sparkles, Building2, Utensils, ArrowRight } from 'lucide-react';

interface DonationCardProps {
  donation: FoodDonation;
  onOpenSmartMatch?: (donation: FoodDonation) => void;
}

export const DonationCard: React.FC<DonationCardProps> = ({ donation, onOpenSmartMatch }) => {
  const deadlineDate = new Date(donation.collectionDeadline);
  const now = new Date();
  const diffHours = Math.round((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
  const isUrgent = diffHours > 0 && diffHours <= 3;
  const isExpired = diffHours <= 0;

  return (
    <div className="bg-white rounded-2xl border border-sand-border shadow-soft hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image & Status Overlay */}
      <div className="relative h-48 w-full bg-sand-subtle overflow-hidden">
        <img
          src={donation.imageUrl}
          alt={donation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={donation.status} size="sm" />
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-forest-dark/85 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-mint" />
            <span>~{donation.estimatedMeals} meals</span>
          </span>
        </div>

        {/* Urgent countdown banner */}
        {isUrgent && donation.status === 'available' && (
          <div className="absolute bottom-0 inset-x-0 bg-coral-dark/95 text-white text-[11px] font-semibold py-1 px-3 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 animate-spin" /> Urgent Window
            </span>
            <span>{diffHours}h remaining</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <CategoryBadge category={donation.category} />
            {donation.dietaryClassification.slice(0, 2).map((diet) => (
              <DietaryBadge key={diet} type={diet} />
            ))}
            {donation.dietaryClassification.length > 2 && (
              <span className="text-[10px] text-charcoal-muted px-1.5 py-0.5 rounded bg-sand-subtle">
                +{donation.dietaryClassification.length - 2}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-forest group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {donation.title}
          </h3>

          {/* Donor Info */}
          <div className="flex items-center gap-1.5 text-xs text-charcoal-muted mb-2">
            <Building2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="truncate font-medium">{donation.donorOrg}</span>
          </div>

          {/* Description */}
          <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed mb-4">
            {donation.description}
          </p>
        </div>

        <div>
          {/* Metadata Grid */}
          <div className="bg-sand-subtle/80 rounded-xl p-3 mb-4 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-charcoal-light block">
                Quantity
              </span>
              <strong className="text-forest font-bold">
                {donation.quantity} {donation.unit}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-charcoal-light block">
                Deadline
              </span>
              <span className={`font-semibold ${isUrgent ? 'text-coral-dark' : 'text-charcoal'}`}>
                {isExpired ? 'Expired' : `${diffHours}h left`}
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-1 text-[11px] text-charcoal-muted truncate pt-1 border-t border-sand-border/50">
              <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="truncate">{donation.pickupLocality}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <Link
              to={`/donations/${donation.id}`}
              className="flex-1 py-2 px-3 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl text-center shadow-sm transition-all flex items-center justify-center gap-1.5 group/btn"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>

            {onOpenSmartMatch && donation.status === 'available' && (
              <button
                onClick={() => onOpenSmartMatch(donation)}
                className="py-2 px-3 bg-mint text-forest-dark hover:bg-mint-dark text-xs font-semibold rounded-xl border border-mint-dark transition-colors flex items-center gap-1"
                title="Smart Rescue Matching Recommendations"
              >
                <Sparkles className="w-3.5 h-3.5 text-forest" />
                <span className="hidden sm:inline">Match</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

