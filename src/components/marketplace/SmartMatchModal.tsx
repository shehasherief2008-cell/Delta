import React from 'react';
import { FoodDonation, SmartMatchResult } from '../../types';
import { rankRecipientsForDonation } from '../../services/matchingService';
import { Modal } from '../common/Modal';
import { Sparkles, MapPin, CheckCircle, AlertTriangle, ShieldCheck, Info, ArrowUpRight } from 'lucide-react';

interface SmartMatchModalProps {
  donation: FoodDonation | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimForOrg?: (recipientOrgId: string) => void;
}

export const SmartMatchModal: React.FC<SmartMatchModalProps> = ({
  donation,
  isOpen,
  onClose,
  onClaimForOrg,
}) => {
  if (!donation) return null;

  const matches = rankRecipientsForDonation(donation);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Rescue Matching Engine"
      subtitle={`Explainable recipient ranking for "${donation.title}"`}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Recommendation Disclaimer banner */}
        <div className="bg-sand-subtle border border-sand-border p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-charcoal">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-forest">Transparent Algorithmic Matching</span>
            <p className="text-[11px] text-charcoal-muted mt-0.5 leading-relaxed">
              This recommendation model deterministically evaluates verified transit distance, recipient intake capacity ({donation.quantity} {donation.unit}), cold storage suitability, and deadline feasibility. No black-box AI — 100% auditable.
            </p>
          </div>
        </div>

        {/* Ranked Recipient List */}
        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {matches.map((match, index) => {
            const isTopMatch = index === 0;

            return (
              <div
                key={match.recipientId}
                className={`p-4 rounded-xl border transition-all ${
                  isTopMatch
                    ? 'border-primary/40 bg-primary-subtle/30 shadow-sm'
                    : 'border-sand-border bg-white'
                }`}
              >
                {/* Header: Name, Score & Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-forest text-sm">{match.recipientName}</span>
                      {match.isVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-mint text-forest-dark font-semibold px-2 py-0.2 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-primary" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-charcoal-muted mt-0.5">
                      <span className="bg-sand-subtle px-2 py-0.5 rounded text-[11px] font-medium">
                        {match.recipientType}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        {match.distanceKm} km away
                      </span>
                    </div>
                  </div>

                  {/* Compatibility Score */}
                  <div className="text-right">
                    <div
                      className={`text-lg font-extrabold ${
                        match.compatibilityScore >= 80
                          ? 'text-primary'
                          : match.compatibilityScore >= 60
                          ? 'text-amber-700'
                          : 'text-charcoal-muted'
                      }`}
                    >
                      {match.compatibilityScore}%
                    </div>
                    <span className="text-[10px] text-charcoal-light uppercase font-semibold">
                      Match Score
                    </span>
                  </div>
                </div>

                {/* Highlights tags */}
                {match.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {match.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-white text-forest border border-sand-border flex items-center gap-1"
                      >
                        <CheckCircle className="w-2.5 h-2.5 text-primary" />
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Algorithmic reasons */}
                <div className="mt-2.5 pt-2 border-t border-sand-border/40 text-[11px] text-charcoal-muted space-y-1">
                  {match.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-primary font-bold">&bull;</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Action button if recipient claiming */}
                {onClaimForOrg && (
                  <div className="mt-3 pt-2 flex justify-end">
                    <button
                      onClick={() => onClaimForOrg(match.recipientId)}
                      className="px-3 py-1.5 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Simulate Claim for {match.recipientName.split(' ')[0]}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-mint" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sand-border hover:bg-sand-border/80 text-charcoal text-xs font-semibold rounded-xl transition-colors"
          >
            Close Recommendations
          </button>
        </div>
      </div>
    </Modal>
  );
};

