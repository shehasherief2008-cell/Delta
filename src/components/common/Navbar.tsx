import React, { useState } from 'react';
import { Link, useLocation } from '../../lib/router';
import { useAuth } from '../../context/AuthContext';
import { 
  HeartHandshake, 
  Menu, 
  X, 
  PlusCircle, 
  Search, 
  Truck, 
  BarChart3, 
  ShieldCheck, 
  User, 
  Layers,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role } = useAuth();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore Donations', href: '/donations' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Impact', href: '/impact' },
    { label: 'About', href: '/about' },
  ];

  const getRoleCta = () => {
    switch (role) {
      case 'donor':
        return {
          href: '/donate',
          label: 'Donate Surplus',
          icon: <PlusCircle className="w-4 h-4" />,
          className: 'bg-primary text-white hover:bg-primary-hover',
        };
      case 'recipient':
        return {
          href: '/donations',
          label: 'Find Food',
          icon: <Search className="w-4 h-4" />,
          className: 'bg-primary text-white hover:bg-primary-hover',
        };
      case 'volunteer':
        return {
          href: '/pickups',
          label: 'My Pickups',
          icon: <Truck className="w-4 h-4" />,
          className: 'bg-forest text-mint hover:bg-forest-light',
        };
      case 'admin':
        return {
          href: '/admin',
          label: 'Moderation',
          icon: <ShieldCheck className="w-4 h-4" />,
          className: 'bg-coral-dark text-white hover:bg-coral',
        };
    }
  };

  const cta = getRoleCta();

  return (
    <header className="sticky top-0 z-40 bg-sand/95 backdrop-blur-md border-b border-sand-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-mint shadow-md group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-5 h-5 text-mint" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-forest tracking-tight">RescuePlate</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
              <p className="text-[10px] text-charcoal-muted tracking-widest font-semibold uppercase -mt-0.5">
                Every Meal Matters
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-forest font-semibold bg-mint/30'
                      : 'text-charcoal-muted hover:text-forest hover:bg-sand-subtle'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/dashboard"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/dashboard'
                  ? 'text-forest font-semibold bg-sand-border/50'
                  : 'text-charcoal-muted hover:text-forest'
              }`}
            >
              <Layers className="w-4 h-4 text-primary" />
              <span>Dashboard</span>
            </Link>

            <Link
              to={cta.href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-soft flex items-center gap-2 transition-all transform active:scale-95 ${cta.className}`}
            >
              {cta.icon}
              <span>{cta.label}</span>
            </Link>

            <Link
              to="/profile"
              className="p-1.5 rounded-xl border border-sand-border bg-white hover:border-primary/40 transition-colors flex items-center gap-2 pr-3"
              title="View Profile"
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <span className="text-xs font-semibold text-charcoal max-w-[90px] truncate hidden md:inline">
                {user.name.split(' ')[0]}
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to={cta.href}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${cta.className}`}
            >
              {cta.icon}
              <span>{cta.label}</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal hover:bg-sand-subtle focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-forest" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-sand-border bg-sand px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-charcoal hover:bg-sand-subtle"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-sand-border/80 pt-3 flex flex-col gap-2">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-forest hover:bg-mint/20"
            >
              <Layers className="w-4 h-4 text-primary" />
              <span>Role Dashboard</span>
            </Link>
            <Link
              to="/pickups"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-forest hover:bg-mint/20"
            >
              <Truck className="w-4 h-4 text-primary" />
              <span>Pickups & Deliveries</span>
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-forest hover:bg-mint/20"
            >
              <User className="w-4 h-4 text-primary" />
              <span>Profile & Role Settings</span>
            </Link>
            {role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-coral-dark hover:bg-coral-light"
              >
                <ShieldCheck className="w-4 h-4 text-coral-dark" />
                <span>Admin Moderation</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

