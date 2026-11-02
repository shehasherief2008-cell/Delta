import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { FoodDonation } from '../types';
import { PickupCard } from '../components/pickups/PickupCard';
import { VerificationModal } from '../components/pickups/VerificationModal';
import { Link } from '../lib/router';
import { 
  Truck, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  Filter,
  Sparkles
} from 'lucide-react';

export const PickupsPage: React.FC = () => {
  const { user, role } = useAuth();
  const [donations, setDonations] = useState<FoodDonation[]>(dataService.getDonations());
  const [activeTab, setActiveTab] = useState<'all' | 'needs_pickup' | 'in_transit' | 'completed'>('all');
  const [verifyingDonation, setVerifyingDonation] = useState<FoodDonation | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setDonations(dataService.getDonations());
    };
    return dataService.subscribe(handleUpdate);
  }, []);

  // Filter pickups
  const activePickups = donations.filter((d) => ['claimed', 'pickup_scheduled', 'in_transit', 'delivered'].includes(d.status));

  const filteredList = activePickups.filter((d) => {
    if (activeTab === 'needs_pickup') {
      return ['claimed', 'pickup_scheduled'].includes(d.status);
    }
    if (activeTab === 'in_transit') {
      return d.status === 'in_transit';
    }
    if (activeTab === 'completed') {
      return d.status === 'delivered';
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Logistics & Distribution Tracker
            </span>
            <span className="text-[10px] bg-mint text-forest-dark font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-primary" /> Verified Safe Handover
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-forest mt-1">Pickups & Deliveries</h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Coordinate transit tasks, verify physical collections with cryptographic codes, and log final handovers.
          </p>
        </div>

        <Link
          to="/donations"
          className="px-4 py-2.5 bg-sand-subtle hover:bg-sand-border text-forest text-xs font-bold rounded-xl border border-sand-border flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <span>Claim Open Surplus</span>
          <ArrowRight className="w-4 h-4 text-primary" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-sand-border pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-forest text-mint shadow-sm'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-sand-subtle'
          }`}
        >
          All Rescue Operations ({activePickups.length})
        </button>

        <button
          onClick={() => setActiveTab('needs_pickup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'needs_pickup'
              ? 'bg-forest text-mint shadow-sm'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-sand-subtle'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Scheduled / Ready for Code Verification</span>
        </button>

        <button
          onClick={() => setActiveTab('in_transit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'in_transit'
              ? 'bg-forest text-mint shadow-sm'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-sand-subtle'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Currently In Transit</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'completed'
              ? 'bg-forest text-mint shadow-sm'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-sand-subtle'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed Handovers</span>
        </button>
      </div>

      {/* List of Tasks */}
      {filteredList.length > 0 ? (
        <div className="space-y-4">
          {filteredList.map((donation) => (
            <PickupCard
              key={donation.id}
              donation={donation}
              onOpenVerifyModal={(d) => setVerifyingDonation(d)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-sand-border p-12 text-center max-w-md mx-auto shadow-soft my-10">
          <Truck className="w-12 h-12 text-charcoal-muted mx-auto mb-3" />
          <h3 className="text-base font-bold text-forest">No tasks in this stage</h3>
          <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
            There are currently no donations matching the "{activeTab.replace('_', ' ')}" filter. Explore the marketplace to claim or list surplus.
          </p>
          <Link
            to="/donations"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
          >
            <span>Explore Surplus Food</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Verification Dialog */}
      <VerificationModal
        donation={verifyingDonation}
        isOpen={Boolean(verifyingDonation)}
        onClose={() => setVerifyingDonation(null)}
      />
    </div>
  );
};

