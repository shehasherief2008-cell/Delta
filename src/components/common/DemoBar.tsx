import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Shield, RotateCcw, User, Check, Info, Sparkles } from 'lucide-react';

export const DemoBar: React.FC = () => {
  const { user, role, switchRole, resetDemoData } = useAuth();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const roles: { role: UserRole; label: string; icon: string; name: string }[] = [
    { role: 'donor', label: 'Donor', icon: '🍽️', name: 'Chef Marcus (Hotel)' },
    { role: 'recipient', label: 'Recipient Org', icon: '🤲', name: 'Elena (Hope Shelter)' },
    { role: 'volunteer', label: 'Volunteer', icon: '🚴', name: 'David (Food Runner)' },
    { role: 'admin', label: 'Admin', icon: '🛡️', name: 'Sarah (Moderator)' },
  ];

  const handleReset = () => {
    resetDemoData();
    setShowConfirmReset(false);
  };

  return (
    <div className="bg-forest text-sand-subtle text-xs border-b border-forest-light py-1.5 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Demo badge & active user */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-mint text-forest-dark font-bold text-[11px] tracking-wide uppercase">
            <Sparkles className="w-3 h-3 text-primary" /> Hackathon Demo Mode
          </span>
          <span className="hidden sm:inline text-sand-border/70 text-[11px]">|</span>
          <div className="flex items-center gap-1.5 text-sand-subtle">
            <User className="w-3.5 h-3.5 text-mint" />
            <span className="text-[11px]">Active Persona:</span>
            <strong className="text-white font-medium">{user.name}</strong>
            <span className="text-[10px] bg-forest-light text-sand px-1.5 py-0.2 rounded border border-forest-light/80 uppercase tracking-wider">
              {role}
            </span>
          </div>
        </div>

        {/* Right: Quick Role Switcher + Reset + Guide */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-forest-dark/80 rounded-lg p-0.5 border border-forest-light/60">
            {roles.map((r) => {
              const isActive = role === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => switchRole(r.role)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm font-semibold'
                      : 'text-sand/80 hover:text-white hover:bg-forest-light/50'
                  }`}
                  title={`Switch active persona to ${r.name}`}
                >
                  <span>{r.icon}</span>
                  <span className="hidden md:inline">{r.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-[11px] px-2 py-1 rounded bg-forest-light/60 text-sand hover:text-white hover:bg-forest-light transition-colors flex items-center gap-1 border border-forest-light"
            title="Judge Walkthrough sequence"
          >
            <Info className="w-3 h-3 text-mint" />
            <span className="hidden sm:inline">Judge Guide</span>
          </button>

          <button
            onClick={() => setShowConfirmReset(true)}
            className="text-[11px] px-2 py-1 rounded bg-coral/20 text-coral-light hover:bg-coral/30 hover:text-white transition-colors flex items-center gap-1 border border-coral/30 font-medium"
            title="Reset simulation data to pristine state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Guide Dropdown banner */}
      {showGuide && (
        <div className="max-w-7xl mx-auto mt-2 p-3 bg-forest-dark/95 border border-forest-light rounded-lg text-sand-subtle text-xs">
          <div className="flex items-start justify-between">
            <div>
              <strong className="text-mint font-semibold">Judge 2-Minute Demonstration Flow:</strong>
              <ol className="list-decimal list-inside mt-1 space-y-0.5 text-sand/90">
                <li>Switch to <strong>Donor</strong> &rarr; Click <strong>Donate Food</strong> (/donate) &rarr; Publish surplus meal.</li>
                <li>Switch to <strong>Recipient</strong> &rarr; Go to <strong>Explore Donations</strong> (/donations) &rarr; Claim the listing.</li>
                <li>Switch to <strong>Volunteer</strong> &rarr; Go to <strong>Pickups</strong> (/pickups) &rarr; Enter verification code to collect & confirm delivery.</li>
                <li>Visit <strong>Impact Dashboard</strong> (/impact) &rarr; Observe live calculated meals and CO2e updates!</li>
              </ol>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="text-sand/70 hover:text-white text-xs px-2 py-0.5 bg-forest-light rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-charcoal rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-sand-border">
            <div className="w-10 h-10 rounded-full bg-coral-light text-coral-dark flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-forest">Reset Demo Data?</h3>
            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
              This will restore all default food donations, volunteer tasks, and impact transactions back to their initial seed state.
            </p>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 text-xs text-charcoal-muted hover:text-charcoal font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 text-xs bg-coral-dark text-white rounded-lg font-semibold hover:bg-coral transition-colors"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

