import React from 'react';
import { FoodDonation } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { dataService } from '../../services/dataService';
import { StatusBadge } from '../common/Badge';
import { Link } from '../../lib/router';
import { 
  Building2, 
  MapPin, 
  Clock, 
  KeyRound, 
  Truck, 
  CheckCircle2, 
  UserCheck, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface PickupCardProps {
  donation: FoodDonation;
  onOpenVerifyModal: (donation: FoodDonation) => void;
}

export const PickupCard: React.FC<PickupCardProps> = ({ donation, onOpenVerifyModal }) => {
  const { user, role } = useAuth();
  const { showToast } = useToast();

  const handleAssignSelfAsVolunteer = () => {
    const res = dataService.assignVolunteer(donation.id, user);
    if (res.success) {
      showToast('success', 'Assigned!', `You are now the active volunteer for "${donation.title}".`);
    } else {
      showToast('error', 'Error', res.message);
    }
  };

  const handleConfirmDelivery = () => {
    const res = dataService.confirmDelivery(donation.id, user);
    if (res.success) {
      showToast('success', 'Delivery Recorded!', res.message);
    } else {
      showToast('error', 'Error', res.message);
    }
  };

  // Status Stepper Steps
  const steps = [
    { key: 'claimed', label: 'Claimed' },
    { key: 'pickup_scheduled', label: 'Scheduled' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getStepIndex = (st: string) => {
    if (st === 'delivered') return 3;
    if (st === 'in_transit') return 2;
    if (st === 'pickup_scheduled') return 1;
    if (st === 'claimed') return 0;
    return -1;
  };

  const currentStep = getStepIndex(donation.status);

  return (
    <div className="bg-white rounded-2xl border border-sand-border p-5 shadow-soft hover:shadow-card transition-all">
      {/* Top Header: Title, Status, Org */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-sand-subtle">
        <div className="flex items-start gap-3">
          <img
            src={donation.imageUrl}
            alt={donation.title}
            className="w-16 h-16 rounded-xl object-cover border border-sand-border flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={donation.status} size="sm" />
              <span className="text-xs text-charcoal-muted font-medium">
                ~{donation.estimatedMeals} meals ({donation.quantity} {donation.unit})
              </span>
            </div>
            <h3 className="text-base font-bold text-forest mt-1 line-clamp-1">{donation.title}</h3>
            <div className="flex items-center gap-2 text-xs text-charcoal-muted mt-0.5">
              <span className="flex items-center gap-1 font-semibold text-charcoal">
                <Building2 className="w-3.5 h-3.5 text-primary" /> {donation.donorOrg}
              </span>
              <span>&rarr;</span>
              <span className="font-semibold text-forest">{donation.claimedByOrgName || 'Pending Organization'}</span>
            </div>
          </div>
        </div>

        {/* Pickup Code for Donors/Recipients */}
        {donation.pickupCode && (
          <div className="bg-sand-subtle px-3 py-2 rounded-xl border border-sand-border text-right sm:text-right">
            <span className="text-[10px] font-bold text-charcoal-light uppercase block tracking-wider">
              Verification Code
            </span>
            <code className="text-sm font-mono font-extrabold text-forest tracking-wider">
              {donation.pickupCode}
            </code>
          </div>
        )}
      </div>

      {/* Workflow Stepper */}
      <div className="py-4">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-sand-border w-full -z-0" />
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white border-2 border-sand-border text-charcoal-light'
                  } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${
                    isCurrent ? 'text-forest font-bold' : 'text-charcoal-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Box */}
      <div className="bg-sand-subtle/70 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-charcoal-light block">Pickup Address</span>
          <p className="text-charcoal font-medium flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="truncate">{donation.pickupAddress}</span>
          </p>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-charcoal-light block">Assigned Volunteer</span>
          <p className="text-charcoal font-medium flex items-center gap-1 mt-0.5">
            <UserCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span>{donation.assignedVolunteerName || 'Unassigned (Volunteer needed)'}</span>
          </p>
        </div>

        {donation.specialInstructions && (
          <div className="sm:col-span-2 text-[11px] text-charcoal-muted pt-1 border-t border-sand-border/50">
            <strong>Handling Instructions:</strong> {donation.specialInstructions}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Link
          to={`/donations/${donation.id}`}
          className="text-xs font-semibold text-charcoal-muted hover:text-forest flex items-center gap-1"
        >
          <span>Listing Specification</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        <div className="flex items-center gap-2">
          {/* Volunteer Self-Assign if currently unassigned */}
          {!donation.assignedVolunteerId && donation.status === 'claimed' && (
            <button
              onClick={handleAssignSelfAsVolunteer}
              className="px-3 py-1.5 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-mint" />
              <span>Claim Pickup Task</span>
            </button>
          )}

          {/* Code verification button for in-person pickup */}
          {['claimed', 'pickup_scheduled'].includes(donation.status) && (
            <button
              onClick={() => onOpenVerifyModal(donation)}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Verify & Collect Handover</span>
            </button>
          )}

          {/* Delivery confirmation button once in transit */}
          {donation.status === 'in_transit' && (
            <button
              onClick={handleConfirmDelivery}
              className="px-4 py-2 bg-forest text-mint hover:bg-forest-light text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-mint" />
              <span>Confirm Safe Recipient Delivery</span>
            </button>
          )}

          {/* Delivered State Indicator */}
          {donation.status === 'delivered' && (
            <span className="text-xs font-bold text-primary flex items-center gap-1 bg-primary-subtle px-3 py-1.5 rounded-xl border border-primary/20">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Handover Logged into Impact Records</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

