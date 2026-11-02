import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from '../lib/router';
import { UserRole } from '../types';
import { 
  HeartHandshake, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  Building2,
  Truck,
  ShieldCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginAsDemoUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('marcus@grandpavilion.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Auto-detect role from email domain or fallback to donor
      let targetRole: UserRole = 'donor';
      if (email.includes('shelter') || email.includes('hope')) targetRole = 'recipient';
      else if (email.includes('volunteer')) targetRole = 'volunteer';
      else if (email.includes('admin')) targetRole = 'admin';

      loginAsDemoUser(targetRole);
      showToast('success', 'Logged in!', `Signed in under Hackathon Demo Mode as ${targetRole.toUpperCase()}`);
      navigate('/dashboard');
    }, 400);
  };

  const handleQuickDemoPersona = (role: UserRole) => {
    loginAsDemoUser(role);
    showToast('success', 'Persona Switched', `Logged in as ${role.toUpperCase()} persona.`);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-sand-border p-8 shadow-card space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest text-mint flex items-center justify-center mx-auto shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-forest">Sign In to RescuePlate</h1>
          <p className="text-xs text-charcoal-muted">
            Connect surplus food to communities in need.
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="bg-sand-subtle border border-sand-border p-3.5 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-forest">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Hackathon Demo Mode Active</span>
          </div>
          <p className="text-[11px] text-charcoal-muted leading-relaxed">
            Click any demo role below for 1-click login, or sign in with your email.
          </p>
        </div>

        {/* 1-Click Demo Persona Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoPersona('donor')}
            className="p-2.5 rounded-xl border border-sand-border bg-sand-subtle/50 hover:bg-mint/40 text-left transition-colors"
          >
            <span className="text-xs font-bold text-forest block">🍽️ Food Donor</span>
            <span className="text-[10px] text-charcoal-muted">Hotel Chef Marcus</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoPersona('recipient')}
            className="p-2.5 rounded-xl border border-sand-border bg-sand-subtle/50 hover:bg-mint/40 text-left transition-colors"
          >
            <span className="text-xs font-bold text-forest block">🤲 Recipient Org</span>
            <span className="text-[10px] text-charcoal-muted">Elena (Hope Shelter)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoPersona('volunteer')}
            className="p-2.5 rounded-xl border border-sand-border bg-sand-subtle/50 hover:bg-mint/40 text-left transition-colors"
          >
            <span className="text-xs font-bold text-forest block">🚴 Volunteer</span>
            <span className="text-[10px] text-charcoal-muted">David (Food Runner)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoPersona('admin')}
            className="p-2.5 rounded-xl border border-sand-border bg-sand-subtle/50 hover:bg-coral-light/50 text-left transition-colors"
          >
            <span className="text-xs font-bold text-forest block">🛡️ Admin</span>
            <span className="text-[10px] text-charcoal-muted">Sarah (Moderator)</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-sand-border w-full" />
          <span className="bg-white px-3 text-[11px] uppercase font-bold text-charcoal-light absolute">
            Or Use Email
          </span>
        </div>

        {/* Standard Email Form */}
        <form onSubmit={handleStandardSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-forest uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => showToast('info', 'Password Reset', 'Reset link dispatched in demo mode.')}
                className="text-[11px] text-primary hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-charcoal"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-soft transition-all flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-charcoal-muted">
          Need an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Register your organization
          </Link>
        </p>
      </div>
    </div>
  );
};

