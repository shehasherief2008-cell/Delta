import React from 'react';
import { Link } from '../../lib/router';
import { HeartHandshake, ShieldCheck, Heart, ExternalLink, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest text-sand-subtle mt-auto border-t border-forest-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest-dark border border-forest-light flex items-center justify-center text-mint">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">RescuePlate</span>
            </div>
            <p className="text-xs text-sand/80 leading-relaxed">
              Every Meal Matters. We connect restaurants, hostels, caterers, and food businesses with accredited community kitchens and shelters to eliminate hunger and end food waste.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-mint">
              <Leaf className="w-3.5 h-3.5" />
              <span>Aligned with UN SDG 2 (Zero Hunger) & 12 (Responsible Consumption)</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-mint uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-sand/80">
              <li>
                <Link to="/donations" className="hover:text-white transition-colors">
                  Available Food Marketplace
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-white transition-colors">
                  List Surplus Food
                </Link>
              </li>
              <li>
                <Link to="/pickups" className="hover:text-white transition-colors">
                  Pickup & Verification Tasks
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-white transition-colors">
                  Transparent Impact Analytics
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How RescuePlate Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Impact & Guidelines */}
          <div>
            <h4 className="text-xs font-bold text-mint uppercase tracking-wider mb-4">Safety & Verification</h4>
            <ul className="space-y-2.5 text-xs text-sand/80">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Food Safety Guidelines & HACCP
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Good Samaritan Legal Protections
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  Recipient Organization Vetting
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Moderation & Community Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-mint uppercase tracking-wider mb-4">Security & Trust</h4>
            <div className="bg-forest-dark/80 p-3.5 rounded-xl border border-forest-light text-xs text-sand/90 space-y-2">
              <div className="flex items-center gap-2 text-mint font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Handover Protocols</span>
              </div>
              <p className="text-[11px] text-sand/70 leading-relaxed">
                All food rescues require unique 6-digit cryptographic verification codes, safe temperature tracking, and authorized sign-offs before impact is counted.
              </p>
            </div>
            <p className="text-[10px] text-sand/60">
              Demo Version 1.0.0 &bull; Built for social impact hackathon.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-forest-light mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand/70">
          <p>&copy; {new Date().getFullYear()} RescuePlate Initiative. Good food deserves another chance.</p>
          <div className="flex items-center gap-1 text-sand/80">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-coral fill-coral mx-1" />
            <span>for communities in need</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

