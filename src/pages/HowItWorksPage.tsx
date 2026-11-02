import React, { useState } from 'react';
import { Link } from '../lib/router';
import { 
  Building2, 
  HeartHandshake, 
  Truck, 
  CheckCircle2, 
  KeyRound, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'donor' | 'recipient' | 'volunteer'>('donor');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          User Guide & Protocols
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest">
          How RescuePlate Works
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Select your organization role below to explore your verified step-by-step redistribution journey.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveRole('donor')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border ${
            activeRole === 'donor'
              ? 'bg-forest text-mint border-forest shadow-soft'
              : 'bg-white text-charcoal-muted border-sand-border hover:bg-sand-subtle'
          }`}
        >
          <Building2 className="w-4 h-4 text-primary" />
          <span>For Food Donors</span>
        </button>

        <button
          onClick={() => setActiveRole('recipient')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border ${
            activeRole === 'recipient'
              ? 'bg-forest text-mint border-forest shadow-soft'
              : 'bg-white text-charcoal-muted border-sand-border hover:bg-sand-subtle'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-primary" />
          <span>For Recipient Shelters</span>
        </button>

        <button
          onClick={() => setActiveRole('volunteer')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border ${
            activeRole === 'volunteer'
              ? 'bg-forest text-mint border-forest shadow-soft'
              : 'bg-white text-charcoal-muted border-sand-border hover:bg-sand-subtle'
          }`}
        >
          <Truck className="w-4 h-4 text-primary" />
          <span>For Volunteer Runners</span>
        </button>
      </div>

      {/* Step Content Card */}
      <div className="bg-white rounded-3xl border border-sand-border p-8 sm:p-12 shadow-soft">
        {activeRole === 'donor' && (
          <div className="space-y-8">
            <div className="border-b border-sand-subtle pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-forest">Food Donor Workflow (Restaurants, Hotels & Caterers)</h2>
                <p className="text-xs text-charcoal-muted mt-1">
                  Turn surplus food into community meals with zero logistical friction.
                </p>
              </div>
              <Link
                to="/donate"
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>List Food Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-sand-subtle/60 border border-sand-border space-y-3">
                <div className="w-8 h-8 rounded-lg bg-mint text-forest-dark font-extrabold flex items-center justify-center text-xs">
                  01
                </div>
                <h3 className="font-bold text-forest text-sm">Post Food in 60 Seconds</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Specify portions or weight, dietary details (e.g. Halal, Vegan), storage state, and pickup window.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sand-subtle/60 border border-sand-border space-y-3">
                <div className="w-8 h-8 rounded-lg bg-primary-subtle text-primary font-extrabold flex items-center justify-center text-xs">
                  02
                </div>
                <h3 className="font-bold text-forest text-sm">Review Verified Claims</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Accredited shelters review and claim. You receive an automated 6-digit handover security code.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sand-subtle/60 border border-sand-border space-y-3">
                <div className="w-8 h-8 rounded-lg bg-forest text-mint font-extrabold flex items-center justify-center text-xs">
                  03
                </div>
                <h3 className="font-bold text-forest text-sm">Confirm Pickup & Track CSR</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  When the courier arrives, verify the code. The system logs tax and ESG metrics directly to your dashboard.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeRole === 'recipient' && (
          <div className="space-y-8">
            <div className="border-b border-sand-subtle pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-forest">Recipient Organization Workflow (Shelters & Kitchens)</h2>
                <p className="text-xs text-charcoal-muted mt-1">
                  Access safe, wholesome food tailored to your kitchen capacity.
                </p>
              </div>
              <Link
                to="/donations"
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Browse Listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-sand-subtle/60 border border-sand-border space-y-3">
                <div className="w-8 h-8 rounded-lg bg-mint text-forest-dark font-extrabold flex items-center justify-center text-xs">
                  01
                </div>
                <h3 className="font-bold text-forest text-sm">Smart Discovery</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Browse real-time listings or let Smart Rescue Matching highlight donations matched to your refrigeration capacity.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sand-subtle/60 border border-sand-border space-y-3">
                <div className="w-8 h-8 rounded-lg bg-primary-subtle text-primary font-extrabold flex items-center justify-center text-xs">
                  02
                </div>
                <h3 className="font-bold text-forest text-sm">Claim & Assign Courier</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Claim with one click. Opt to pick up directly or broadcast the task to verified volunteer drivers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sand-subtle/60 border border-sand-border space-y-3">
                <div className="w-8 h-8 rounded-lg bg-forest text-mint font-extrabold flex items-center justify-center text-xs">
                  03
                </div>
                <h3 className="font-bold text-forest text-sm">Intake & Community Serving</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Inspect temperature on arrival, sign off handover, and serve nourishing meals to your community members.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeRole === 'volunteer' && (
          <div className="space-y-8">
            <div className="border-b border-sand-subtle pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-forest">Volunteer Runner Workflow</h2>
                <p className="text-xs text-charcoal-muted mt-1">
                  Deliver food safely across city transit corridors in under 60 minutes.
                </p>
              </div>
              <Link
                to="/pickups"
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>View Open Pickups</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-sand-subtle/60 border border-sand-border space-y-3">
                <div className="w-8 h-8 rounded-lg bg-mint text-forest-dark font-extrabold flex items-center justify-center text-xs">
                  01
                </div>
                <h3 className="font-bold text-forest text-sm">Accept Transit Route</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Browse open pickup requests near your route. Claim tasks that match your vehicle capacity.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sand-subtle/60 border border-sand-border space-y-3">
                <div className="w-8 h-8 rounded-lg bg-primary-subtle text-primary font-extrabold flex items-center justify-center text-xs">
                  02
                </div>
                <h3 className="font-bold text-forest text-sm">Input Security Code</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Arrive at donor premises, check thermal packaging, and enter the 6-character verification code to transition the batch into transit.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sand-subtle/60 border border-sand-border space-y-3">
                <div className="w-8 h-8 rounded-lg bg-forest text-mint font-extrabold flex items-center justify-center text-xs">
                  03
                </div>
                <h3 className="font-bold text-forest text-sm">Deliver & Earn Badges</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Drop off batch at the recipient shelter door. Confirm delivery to instantly record rescued meal impact.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-sand-subtle rounded-3xl border border-sand-border p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-forest">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-charcoal-muted leading-relaxed">
          <div className="bg-white p-5 rounded-2xl border border-sand-border space-y-1.5">
            <h4 className="font-bold text-forest text-sm">Is there any fee to use RescuePlate?</h4>
            <p>
              No. RescuePlate is completely free for donors, recipients, and volunteers. It operates as a public community infrastructure.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sand-border space-y-1.5">
            <h4 className="font-bold text-forest text-sm">What happens if a pickup deadline expires?</h4>
            <p>
              Listings that pass their safe collection window are automatically retired from the marketplace to ensure food safety guarantees.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sand-border space-y-1.5">
            <h4 className="font-bold text-forest text-sm">Can individual households donate food?</h4>
            <p>
              Currently, RescuePlate focuses on commercial kitchens, licensed hotels, and university hostels to maintain strict HACCP safety documentation.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sand-border space-y-1.5">
            <h4 className="font-bold text-forest text-sm">How does the 6-digit verification code work?</h4>
            <p>
              It is a cryptographic confirmation code issued strictly to the donor upon claim, preventing unauthorized parties from collecting food.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

