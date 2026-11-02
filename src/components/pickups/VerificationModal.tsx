import React, { useState } from 'react';
import { FoodDonation } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { dataService } from '../../services/dataService';
import { Modal } from '../common/Modal';
import { KeyRound, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface VerificationModalProps {
  donation: FoodDonation | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  donation,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!donation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter the 6-character verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    // Call state machine verification in dataService
    const res = dataService.verifyPickup(donation.id, code.trim(), user);

    setTimeout(() => {
      setLoading(false);
      if (res.success) {
        showToast('success', 'Pickup Verified!', res.message);
        setCode('');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError(res.message);
      }
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Surplus Food Pickup"
      subtitle={`Enter the cryptographic handover code provided by ${donation.donorOrg}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Verification Info Box */}
        <div className="bg-sand-subtle border border-sand-border p-3.5 rounded-xl text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-forest">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Authorized Food Handover Protocol</span>
          </div>
          <p className="text-charcoal-muted leading-relaxed">
            To prevent unauthorized collection or theft of surplus donations, the donor holds a unique 6-character code generated upon claim confirmation.
          </p>
          {donation.pickupCode && (
            <div className="pt-1 text-[11px] text-primary font-semibold flex items-center gap-1 bg-mint/40 p-2 rounded-lg border border-mint">
              <span>Demo Helper (Simulated Donor Display):</span>
              <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-forest">
                {donation.pickupCode}
              </code>
            </div>
          )}
        </div>

        {/* Input */}
        <div>
          <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1.5">
            6-Character Pickup Code
          </label>
          <div className="relative">
            <KeyRound className="w-5 h-5 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="e.g. RP-4829"
              maxLength={8}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand-border bg-sand-subtle/30 text-base font-mono font-bold tracking-widest text-forest uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              autoFocus
            />
          </div>
          {error && (
            <div className="mt-2 text-xs text-coral-dark font-medium flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Checklist confirmation */}
        <div className="bg-sand-subtle/50 p-3 rounded-xl border border-sand-border/70 text-xs text-charcoal-muted space-y-1">
          <div className="font-semibold text-charcoal flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Physical Handover Inspection:
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1">
            <li>Food temperature verified ({donation.storageRequirement})</li>
            <li>Packaging is sealed and intact</li>
            <li>Carriers sanitized before loading</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-charcoal-muted hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Validating...' : 'Verify & Authorize Pickup'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

