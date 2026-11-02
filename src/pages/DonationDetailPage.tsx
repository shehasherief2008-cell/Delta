import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from '../lib/router';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dataService } from '../services/dataService';
import { FoodDonation } from '../types';
import { StatusBadge, CategoryBadge, DietaryBadge } from '../components/common/Badge';
import { SmartMatchModal } from '../components/marketplace/SmartMatchModal';
import { 
  Building2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Sparkles, 
  ArrowLeft, 
  Flag, 
  Thermometer, 
  Scale,
  Calendar,
  Lock,
  Phone
} from 'lucide-react';

export const DonationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [donation, setDonation] = useState<FoodDonation | undefined>(() =>
    dataService.getDonationById(id || '')
  );
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showSmartMatch, setShowSmartMatch] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Safety Concern');
  const [reportDetails, setReportDetails] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setDonation(dataService.getDonationById(id || ''));
    };
    return dataService.subscribe(handleUpdate);
  }, [id]);

  if (!donation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-forest">Donation Listing Not Found</h2>
        <p className="text-sm text-charcoal-muted mt-2">
          The requested listing may have expired, been removed, or does not exist.
        </p>
        <Link
          to="/donations"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Marketplace</span>
        </Link>
      </div>
    );
  }

  const deadlineDate = new Date(donation.collectionDeadline);
  const now = new Date();
  const hoursRemaining = Math.round((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
  const isExpired = hoursRemaining <= 0;

  const handleClaim = () => {
    setClaimLoading(true);
    const res = dataService.claimDonation(donation.id, user);

    setTimeout(() => {
      setClaimLoading(false);
      setShowClaimModal(false);
      if (res.success) {
        showToast(
          'success',
          'Claim Confirmed!',
          `Verification Security Code: ${res.pickupCode}. Please assign or coordinate pickup.`
        );
      } else {
        showToast('error', 'Claim Failed', res.message);
      }
    }, 400);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.reportListing(donation.id, user.name, reportReason, reportDetails);
    setShowReportModal(false);
    showToast('info', 'Report Submitted', 'Our moderation team will review this listing promptly.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top back navigation & actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/donations"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-muted hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSmartMatch(true)}
            className="px-3 py-1.5 bg-mint text-forest-dark hover:bg-mint-dark text-xs font-bold rounded-xl border border-mint-dark transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-forest" />
            <span>Smart Match Recommendations</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="p-2 text-charcoal-light hover:text-coral-dark rounded-xl hover:bg-coral-light/50 transition-colors"
            title="Report inaccurate or unsafe listing"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image, Badges & Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative rounded-3xl overflow-hidden border border-sand-border shadow-soft bg-white">
            <img
              src={donation.imageUrl}
              alt={donation.title}
              className="w-full h-80 sm:h-96 object-cover"
            />
            <div className="absolute top-4 left-4">
              <StatusBadge status={donation.status} />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-forest-dark/90 backdrop-blur-md text-white p-3.5 rounded-2xl flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-mint" />
                <span className="font-semibold">{donation.storageRequirement}</span>
              </span>
              <span className="font-bold text-mint">
                {donation.quantity} {donation.unit} (~{donation.estimatedMeals} meals)
              </span>
            </div>
          </div>

          {/* Description & Detailed Information */}
          <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <CategoryBadge category={donation.category} />
                {donation.dietaryClassification.map((diet) => (
                  <DietaryBadge key={diet} type={diet} />
                ))}
              </div>
              <h1 className="text-2xl font-extrabold text-forest">{donation.title}</h1>
            </div>

            <p className="text-sm text-charcoal leading-relaxed">{donation.description}</p>

            {/* Storage & Allergens Warning Box */}
            <div className="bg-sand-subtle/80 rounded-xl p-4 border border-sand-border space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-forest">Allergen Declarations:</strong>
                  <div className="text-charcoal-muted mt-0.5">
                    {donation.allergens && donation.allergens.length > 0
                      ? donation.allergens.join(', ')
                      : 'No major common allergens specified by donor.'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-sand-border/50">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-forest">Food Safety Compliance:</strong>
                  <div className="text-charcoal-muted mt-0.5">
                    Donor affirmed Good Samaritan food handling & temperature regulation at time of listing. Recipient is responsible for inspecting upon pickup.
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-charcoal-muted">
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal-light block">Prepared</span>
                <span className="font-medium text-charcoal">
                  {new Date(donation.preparedAt).toLocaleDateString()} at{' '}
                  {new Date(donation.preparedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal-light block">Collection Deadline</span>
                <span className={`font-bold ${hoursRemaining <= 3 ? 'text-coral-dark' : 'text-forest'}`}>
                  {isExpired ? 'Expired' : `${hoursRemaining} hours left`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Donor, Pickup Address & Claim Action */}
        <div className="lg:col-span-5 space-y-6">
          {/* Claim Action Box */}
          <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft">
            <h3 className="text-base font-bold text-forest mb-1">Redistribution Status</h3>
            <p className="text-xs text-charcoal-muted mb-4">
              Status updates reflect verified real-time platform transactions.
            </p>

            {/* Current Status Banner */}
            <div className="mb-5 p-4 rounded-xl bg-sand-subtle border border-sand-border flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-charcoal-light uppercase block">
                  Current State
                </span>
                <span className="font-extrabold text-forest text-base capitalize">
                  {donation.status.replace('_', ' ')}
                </span>
              </div>
              <StatusBadge status={donation.status} />
            </div>

            {/* Claimed Code Display if applicable */}
            {donation.pickupCode && (
              <div className="mb-5 p-4 rounded-xl bg-mint/40 border border-mint text-center">
                <span className="text-[11px] font-bold text-forest-dark uppercase block tracking-wider">
                  Cryptographic Pickup Code
                </span>
                <code className="text-2xl font-mono font-extrabold text-forest tracking-widest mt-1 block">
                  {donation.pickupCode}
                </code>
                <p className="text-[11px] text-forest-dark mt-1 font-medium">
                  Provide this 6-character code upon physical collection.
                </p>
              </div>
            )}

            {/* Primary Action Button */}
            {donation.status === 'available' ? (
              <div className="space-y-3">
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-soft transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Claim Donation for Organization</span>
                </button>
                <p className="text-[11px] text-center text-charcoal-muted">
                  Reserved exclusively for verified community kitchens, shelters, and food relief partners.
                </p>
              </div>
            ) : donation.status === 'claimed' || donation.status === 'pickup_scheduled' ? (
              <div className="space-y-3">
                <Link
                  to="/pickups"
                  className="w-full py-3 bg-forest hover:bg-forest-light text-white text-xs font-bold rounded-xl shadow-soft transition-all flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4 text-mint" />
                  <span>Go to Pickups & Verification</span>
                </Link>
                <div className="text-xs text-charcoal-muted bg-sand-subtle p-3 rounded-xl border border-sand-border">
                  <strong>Claimed by:</strong> {donation.claimedByOrgName}
                </div>
              </div>
            ) : donation.status === 'delivered' ? (
              <div className="p-4 rounded-xl bg-primary-subtle text-primary border border-primary/30 text-center text-xs font-semibold">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-primary" />
                <span>Successfully Delivered & Logged in Community Impact</span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-stone-100 text-stone-700 text-center text-xs font-medium">
                This listing is no longer active.
              </div>
            )}
          </div>

          {/* Donor Information Card */}
          <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-forest uppercase tracking-wider">
              Food Donor Organization
            </h3>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-mint/50 flex items-center justify-center text-forest flex-shrink-0">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-base font-bold text-forest">{donation.donorOrg}</h4>
                <div className="flex items-center gap-1.5 text-xs text-charcoal-muted mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Verified Registered Food Business</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-sand-subtle p-3 rounded-xl border border-sand-border text-xs space-y-1">
              <span className="text-[10px] font-bold text-charcoal-light uppercase block">
                Pickup Address
              </span>
              <p className="font-semibold text-charcoal flex items-start gap-1">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{donation.pickupAddress}</span>
              </p>
              <span className="text-[11px] text-charcoal-muted block pl-5">
                District: {donation.pickupLocality}
              </span>
            </div>

            {donation.specialInstructions && (
              <div className="text-xs text-charcoal-muted pt-1">
                <strong className="text-charcoal">Donor Instructions:</strong>{' '}
                {donation.specialInstructions}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claim Confirmation Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-sand-border">
            <h3 className="text-lg font-bold text-forest">Confirm Surplus Claim</h3>
            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
              You are claiming <strong className="text-forest">{donation.quantity} {donation.unit}</strong> of{' '}
              <strong className="text-forest">{donation.title}</strong> on behalf of{' '}
              <strong className="text-forest">{user.organizationName || user.name}</strong>.
            </p>

            <div className="bg-sand-subtle p-3 rounded-xl border border-sand-border my-4 text-xs space-y-1">
              <div className="font-semibold text-forest">Recipient Obligations:</div>
              <ul className="list-disc list-inside text-charcoal-muted space-y-0.5 text-[11px]">
                <li>Collect prior to deadline ({new Date(donation.collectionDeadline).toLocaleTimeString()})</li>
                <li>Verify temperature and packaging integrity upon handover</li>
                <li>Distribute free of charge to community beneficiaries</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowClaimModal(false)}
                className="px-4 py-2 text-xs font-semibold text-charcoal-muted hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={handleClaim}
                disabled={claimLoading}
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                {claimLoading ? 'Processing Claim...' : 'Confirm & Generate Pickup Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-sand-border">
            <h3 className="text-lg font-bold text-forest">Report Listing to Moderation</h3>
            <p className="text-xs text-charcoal-muted mt-1">
              Help maintain community trust and food safety standards.
            </p>
            <form onSubmit={handleReportSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-forest uppercase mb-1">
                  Reason for Report
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-border text-xs text-charcoal"
                >
                  <option value="Safety Concern">Food Safety / Perishability Concern</option>
                  <option value="Inaccurate Information">Inaccurate Quantity or Allergen Info</option>
                  <option value="Expired Listing">Listing has Already Expired</option>
                  <option value="Unreachable Donor">Donor Unresponsive or Address Invalid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest uppercase mb-1">
                  Details
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={3}
                  placeholder="Provide context for moderation..."
                  className="w-full p-2.5 rounded-xl border border-sand-border text-xs text-charcoal"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-charcoal-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-coral-dark text-white text-xs font-bold rounded-xl"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Smart Match Modal */}
      <SmartMatchModal
        donation={donation}
        isOpen={showSmartMatch}
        onClose={() => setShowSmartMatch(false)}
        onClaimForOrg={(orgId) => {
          setShowSmartMatch(false);
          setShowClaimModal(true);
        }}
      />
    </div>
  );
};

