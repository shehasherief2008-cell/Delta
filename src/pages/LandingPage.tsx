import React, { useState, useEffect } from 'react';
import { Link } from '../lib/router';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { FoodDonation, ImpactStats } from '../types';
import { DonationCard } from '../components/marketplace/DonationCard';
import { SmartMatchModal } from '../components/marketplace/SmartMatchModal';
import { 
  HeartHandshake, 
  Utensils, 
  ShieldCheck, 
  Clock, 
  Truck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Leaf, 
  Building2, 
  Users, 
  Award,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { role } = useAuth();
  const [featuredDonations, setFeaturedDonations] = useState<FoodDonation[]>([]);
  const [stats, setStats] = useState<ImpactStats>(dataService.getImpactStats());
  const [selectedDonationForMatch, setSelectedDonationForMatch] = useState<FoodDonation | null>(null);

  useEffect(() => {
    const updateData = () => {
      const all = dataService.getDonations();
      // Show top 3 available or active donations
      setFeaturedDonations(all.slice(0, 3));
      setStats(dataService.getImpactStats());
    };
    updateData();
    return dataService.subscribe(updateData);
  }, []);

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28">
        {/* Soft background ambient shapes */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-mint/40 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 -z-10 w-80 h-80 bg-sand-border/80 rounded-full blur-3xl opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/50 border border-mint text-forest-dark text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Social Impact Platform &bull; Every Meal Matters</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest tracking-tight leading-[1.12]">
                Good food deserves <br />
                <span className="text-primary italic font-serif">another chance.</span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal-muted max-w-xl leading-relaxed">
                Rescue surplus food. Connect communities. Create change. RescuePlate connects restaurants, hotels, hostels, and caterers with accredited local shelters and verified volunteers to eliminate hunger.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/donate"
                  className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-soft hover:shadow-card transition-all flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Donate Surplus Food</span>
                </Link>

                <Link
                  to="/donations"
                  className="px-6 py-3.5 bg-white hover:bg-sand-subtle text-forest border border-sand-border text-sm font-bold rounded-xl shadow-soft transition-all flex items-center justify-center gap-2"
                >
                  <span>Find Available Food</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </Link>
              </div>

              {/* Social Proof Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-charcoal-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>HACCP Safe Handling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Verified 501(c)(3) Shelters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span>Zero Food Waste Mission</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Hero Composite Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lifted border border-sand-border bg-white p-2">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
                  alt="Volunteers packaging and sharing nutritious meals"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />

                {/* Floating Metric Pill: Meals Rescued */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-card border border-sand-border flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-charcoal-light uppercase tracking-wider block">
                      Redistributed So Far
                    </span>
                    <span className="text-2xl font-extrabold text-forest">
                      {stats.totalMealsSupported.toLocaleString()}+ Meals
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-mint flex items-center justify-center text-forest-dark">
                    <HeartHandshake className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Floating Active Status Tag */}
                <div className="absolute top-6 left-6 bg-forest-dark/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-mint animate-ping" />
                  <span>Active Rescue Network</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE SOCIAL PROBLEM BREAKDOWN */}
      <section className="bg-white py-16 border-y border-sand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              The Reality We Face
            </span>
            <h2 className="text-3xl font-extrabold text-forest mt-1.5">
              Why RescuePlate Was Created
            </h2>
            <p className="text-sm text-charcoal-muted mt-3 leading-relaxed">
              Every single day, high-quality, freshly prepared food goes to waste simply due to coordination bottlenecks and lack of transparent verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-sand-subtle/50 rounded-2xl p-6 border border-sand-border text-center">
              <div className="text-4xl font-extrabold text-coral-dark mb-2">1 in 8</div>
              <h3 className="text-base font-bold text-forest mb-2">Community Members</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Experience inconsistent access to wholesome, nutritious meals while nearby commercial venues discard surplus.
              </p>
            </div>

            <div className="bg-sand-subtle/50 rounded-2xl p-6 border border-sand-border text-center">
              <div className="text-4xl font-extrabold text-primary mb-2">35%</div>
              <h3 className="text-base font-bold text-forest mb-2">Commercial Surplus Wasted</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                From conference banquets to hotel breakfasts and college canteens, edible food is lost when it could feed families.
              </p>
            </div>

            <div className="bg-sand-subtle/50 rounded-2xl p-6 border border-sand-border text-center">
              <div className="text-4xl font-extrabold text-forest mb-2">&lt; 90 Min</div>
              <h3 className="text-base font-bold text-forest mb-2">Target Transit Window</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                RescuePlate accelerates pickup coordination to safely preserve temperature compliance from kitchen to table.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW RESCUEPLATE WORKS (3 SIMPLE STEPS) */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Streamlined Redistribution
            </span>
            <h2 className="text-3xl font-extrabold text-forest mt-1.5">
              How RescuePlate Works in 3 Steps
            </h2>
            <p className="text-sm text-charcoal-muted mt-3">
              A transparent, safe, and closed-loop process from kitchen surplus to verified community impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-7 border border-sand-border shadow-soft relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-mint/60 text-forest-dark flex items-center justify-center font-extrabold text-lg mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">Donor Lists Surplus Food</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Restaurants, hostels, or caterers specify quantity, preparation time, storage requirements, allergens, and pickup deadline.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-sand-subtle flex items-center gap-1.5 text-xs text-primary font-semibold">
                <span>Safe temperature verification</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-7 border border-sand-border shadow-soft relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-subtle text-primary flex items-center justify-center font-extrabold text-lg mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">Smart Match & Organization Claim</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Accredited shelters discover matching donations. Our Smart Matching engine prioritizes capacity, proximity, and deadline feasibility.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-sand-subtle flex items-center gap-1.5 text-xs text-primary font-semibold">
                <span>Unique 6-digit code issued</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-7 border border-sand-border shadow-soft relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-forest text-mint flex items-center justify-center font-extrabold text-lg mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">Verified Pickup & Impact Log</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Volunteer or recipient inputs the cryptographic security code at donor premises. Delivery is confirmed, and verified impact metrics update live.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-sand-subtle flex items-center gap-1.5 text-xs text-forest font-semibold">
                <span>Zero waste recorded on ledger</span>
                <Award className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SURPLUS DONATIONS (LIVE MARKETPLACE PREVIEW) */}
      <section className="bg-sand-subtle py-16 border-y border-sand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Available Right Now
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-forest mt-1">
                Featured Surplus Food Donations
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                Real active rescue opportunities ready for verified recipient organizations.
              </p>
            </div>
            <Link
              to="/donations"
              className="text-xs sm:text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 group"
            >
              <span>View All Available Food</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onOpenSmartMatch={(d) => setSelectedDonationForMatch(d)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* USER PERSONAS SECTION (DONORS, RECIPIENTS, VOLUNTEERS) */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Built for Every Stakeholder
            </span>
            <h2 className="text-3xl font-extrabold text-forest mt-1.5">
              How Each Community Member Helps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Donor */}
            <div className="bg-white rounded-2xl p-6 border border-sand-border shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-mint/50 flex items-center justify-center text-forest mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">Food Donors</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed mb-4">
                  Hotels, restaurants, event caterers, and campus dining halls reduce waste disposal costs, fulfill CSR mandates, and receive documented social impact reporting.
                </p>
                <ul className="text-xs text-charcoal space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> 60-second listing flow
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Tax credit & CSR audit receipts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Good Samaritan liability protection
                  </li>
                </ul>
              </div>
              <Link
                to="/donate"
                className="mt-6 text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
              >
                <span>List Your Surplus</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Recipient */}
            <div className="bg-white rounded-2xl p-6 border border-sand-border shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-subtle flex items-center justify-center text-primary mb-4">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">Recipient Organizations</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed mb-4">
                  Community kitchens, night shelters, youth centers, and pantries gain reliable access to wholesome, balanced meals for those they serve.
                </p>
                <ul className="text-xs text-charcoal space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Dietary & allergen transparency
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Smart matching for intake capacity
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Zero subscription or platform fees
                  </li>
                </ul>
              </div>
              <Link
                to="/donations"
                className="mt-6 text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
              >
                <span>Discover Suitable Donations</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Volunteers */}
            <div className="bg-white rounded-2xl p-6 border border-sand-border shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sand-border/80 flex items-center justify-center text-forest mb-4">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">Volunteer Champions</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed mb-4">
                  Compassionate local couriers and drivers coordinate swift collections and drop-offs to bridge the last mile safely.
                </p>
                <ul className="text-xs text-charcoal space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Clear route and instruction details
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Secure cryptographic code verification
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Track personal impact hours
                  </li>
                </ul>
              </div>
              <Link
                to="/pickups"
                className="mt-6 text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
              >
                <span>View Open Pickup Tasks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest rounded-3xl p-8 sm:p-12 text-center text-sand-subtle relative overflow-hidden shadow-lifted">
          <div className="absolute top-0 right-0 w-80 h-80 bg-mint/20 rounded-full blur-3xl opacity-30" />
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-mint">
              Take Action Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              No Wholesome Meal Should Go to Waste.
            </h2>
            <p className="text-sm text-sand/80 leading-relaxed">
              Join dozens of culinary professionals and verified community partners redistributing surplus food across our city.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/donate"
                className="w-full sm:w-auto px-6 py-3 bg-mint hover:bg-mint-dark text-forest-dark font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Start Donating Food
              </Link>
              <Link
                to="/impact"
                className="w-full sm:w-auto px-6 py-3 bg-forest-light hover:bg-forest-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-forest-light transition-colors"
              >
                Explore Live Impact Data
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Rescue Match Modal */}
      <SmartMatchModal
        donation={selectedDonationForMatch}
        isOpen={Boolean(selectedDonationForMatch)}
        onClose={() => setSelectedDonationForMatch(null)}
      />
    </div>
  );
};

