import React from 'react';
import { Link } from '../lib/router';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Leaf, 
  Users, 
  Scale, 
  Award, 
  FileCheck, 
  Globe2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Our Social Purpose
        </span>
        <h1 className="text-4xl font-extrabold text-forest tracking-tight">
          Every Meal Matters. <br />
          <span className="text-primary italic font-serif">Good food deserves another chance.</span>
        </h1>
        <p className="text-sm text-charcoal-muted leading-relaxed">
          RescuePlate was built under the social-impact hackathon mission: "A Better Tomorrow" to solve one of the most painful paradoxes of modern society — food waste amidst community hunger.
        </p>
      </div>

      {/* The Core Mission Card */}
      <div className="bg-white rounded-3xl border border-sand-border p-8 sm:p-12 shadow-soft space-y-6">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-bold text-forest">The Challenge We Are Solving</h2>
          <p className="text-sm text-charcoal leading-relaxed">
            In every metropolitan area, high-grade banquet spreads, hotel breakfast surplus, fresh bakery output, and collegiate cafeteria batches are discarded daily. At the same time, community shelters and food pantries struggle to procure protein-rich, nourishing meals for vulnerable populations.
          </p>
          <p className="text-sm text-charcoal leading-relaxed">
            The failure has never been lack of good food or compassionate organizations — it is an acute logistical, transparency, and trust barrier. Conventional platforms fail because they treat perishable meals like dry ecommerce inventory, without temperature tracking, verification codes, or safety safeguards.
          </p>
          <p className="text-sm text-charcoal leading-relaxed">
            <strong>RescuePlate</strong> bridges this divide by providing a closed-loop platform that coordinates donor listings, algorithmic Smart Rescue Matching, volunteer routing, and cryptographic verification receipts.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-sand-subtle">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-mint text-forest-dark flex items-center justify-center font-bold">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold text-forest">Environmental Rescue</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Every kilogram of surplus food saved avoids ~2.5 kg of atmospheric CO2 emissions produced by anaerobic decomposition in city landfills.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-forest">Dignity in Nutrition</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              We focus on wholesome, cooked meals and fresh produce — ensuring recipient communities receive balanced nutrition rather than just discarded scraps.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sand-border text-forest flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold text-forest">Legal & Safety Clarity</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Protected by the Bill Emerson Good Samaritan Food Donation Act, which legally insulates food donors donating in good faith to non-profit entities.
            </p>
          </div>
        </div>
      </div>

      {/* Food Safety & Trust Section */}
      <div className="bg-sand-subtle rounded-3xl border border-sand-border p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-forest">Food Safety & Compliance Framework</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-charcoal-muted leading-relaxed">
          <div className="bg-white p-5 rounded-2xl border border-sand-border space-y-2">
            <h4 className="font-bold text-forest text-sm flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-primary" />
              <span>HACCP Temperature Controls</span>
            </h4>
            <p>
              Donors must classify whether batches require hot holding (&gt;60°C) or refrigeration (0-4°C). Couriers carry thermal test logs and verified cambro carriers.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sand-border space-y-2">
            <h4 className="font-bold text-forest text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span>Accreditation & Vetting</span>
            </h4>
            <p>
              Recipient organizations undergo tax-exempt 501(c)(3) and safe kitchen hygiene checks before receiving access to sensitive commercial donor addresses.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sand-border space-y-2">
            <h4 className="font-bold text-forest text-sm flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-primary" />
              <span>Good Samaritan Act Protection</span>
            </h4>
            <p>
              Under Federal Law (42 U.S. Code § 1791), food donors and recipient non-profits are protected from civil and criminal liability when donating wholesome food in good faith.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sand-border space-y-2">
            <h4 className="font-bold text-forest text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-primary" />
              <span>Cryptographic Handover Codes</span>
            </h4>
            <p>
              Each claim generates a unique 6-character code held by the donor. Handover occurs only when verified against the platform database, eliminating rogue pickups.
            </p>
          </div>
        </div>
      </div>

      {/* Sustainable Development Goals Alignment */}
      <div className="bg-forest text-sand-subtle rounded-3xl p-8 sm:p-10 shadow-card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-mint uppercase tracking-wider">
              United Nations Alignment
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              Targeting SDG 2 (Zero Hunger) & SDG 12 (Responsible Consumption)
            </h3>
            <p className="text-xs text-sand/80 max-w-xl">
              By redirecting 100% of edible surplus within urban centers, we make measurable progress toward the global target of halving per capita food waste by 2030.
            </p>
          </div>

          <Link
            to="/impact"
            className="px-6 py-3 bg-mint hover:bg-mint-dark text-forest-dark font-bold text-xs uppercase tracking-wider rounded-xl transition-colors whitespace-nowrap shadow-soft"
          >
            Inspect Our Impact Data
          </Link>
        </div>
      </div>
    </div>
  );
};

