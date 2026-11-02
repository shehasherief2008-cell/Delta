import React, { useState, useEffect, useMemo } from 'react';
import { FoodDonation } from '../types';
import { dataService } from '../services/dataService';
import { DonationCard } from '../components/marketplace/DonationCard';
import { DonationFilters } from '../components/marketplace/DonationFilters';
import { SmartMatchModal } from '../components/marketplace/SmartMatchModal';
import { Link } from '../lib/router';
import { Utensils, PlusCircle, AlertCircle, Sparkles } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const [donations, setDonations] = useState<FoodDonation[]>(dataService.getDonations());
  const [selectedMatchDonation, setSelectedMatchDonation] = useState<FoodDonation | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    dietary: 'All',
    sortBy: 'deadline' as 'deadline' | 'newest' | 'quantity',
    availableOnly: true,
  });

  useEffect(() => {
    const handleUpdate = () => {
      setDonations(dataService.getDonations());
    };
    return dataService.subscribe(handleUpdate);
  }, []);

  const filteredDonations = useMemo(() => {
    return donations
      .filter((item) => {
        // Availability
        if (filters.availableOnly && item.status !== 'available') return false;

        // Search
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchOrg = item.donorOrg.toLowerCase().includes(q);
          const matchLoc = item.pickupLocality.toLowerCase().includes(q);
          if (!matchTitle && !matchOrg && !matchLoc) return false;
        }

        // Category
        if (filters.category !== 'All' && item.category !== filters.category) {
          return false;
        }

        // Dietary
        if (filters.dietary !== 'All') {
          if (!item.dietaryClassification.includes(filters.dietary as any)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'deadline') {
          return new Date(a.collectionDeadline).getTime() - new Date(b.collectionDeadline).getTime();
        } else if (filters.sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (filters.sortBy === 'quantity') {
          return b.quantity - a.quantity;
        }
        return 0;
      });
  }, [donations, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Live Surplus Exchange
            </span>
            <span className="text-[10px] bg-mint text-forest-dark font-bold px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-forest mt-1">
            Food Donation Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Browse and claim quality surplus food listings ready for verified community redistribution.
          </p>
        </div>

        <Link
          to="/donate"
          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-soft flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List Surplus Food</span>
        </Link>
      </div>

      {/* Filter Component */}
      <DonationFilters
        filters={filters}
        onChange={setFilters}
        totalResults={filteredDonations.length}
      />

      {/* Grid of Listings */}
      {filteredDonations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              onOpenSmartMatch={(d) => setSelectedMatchDonation(d)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-sand-border p-12 text-center max-w-md mx-auto shadow-soft my-12">
          <div className="w-14 h-14 rounded-full bg-sand-subtle flex items-center justify-center mx-auto mb-4 text-charcoal-muted">
            <Utensils className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-forest">No listings match your criteria</h3>
          <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
            Try adjusting your search terms, widening your category filters, or switching to view all listings including recently claimed batches.
          </p>
          <button
            onClick={() =>
              setFilters({
                search: '',
                category: 'All',
                dietary: 'All',
                sortBy: 'deadline',
                availableOnly: false,
              })
            }
            className="mt-5 px-4 py-2 bg-sand-border hover:bg-sand-border/80 text-forest text-xs font-bold rounded-xl transition-colors"
          >
            Show All Listings
          </button>
        </div>
      )}

      {/* Smart Rescue Matching Modal */}
      <SmartMatchModal
        donation={selectedMatchDonation}
        isOpen={Boolean(selectedMatchDonation)}
        onClose={() => setSelectedMatchDonation(null)}
      />
    </div>
  );
};

