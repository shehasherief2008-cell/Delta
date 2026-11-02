import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from '../lib/router';
import { UserRole } from '../types';
import { 
  HeartHandshake, 
  Building2, 
  Truck, 
  Lock, 
  Mail, 
  User, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { setUser, switchRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState<'donor' | 'recipient' | 'volunteer'>('donor');
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast('error', 'Incomplete Form', 'Please fill out all required fields.');
      return;
    }

    // Explicit security rule: regular registration can never grant admin or automatic verified status
    const newUser = {
      id: `user-${Date.now().toString(36)}`,
      name: name.trim(),
      email: email.trim(),
      role: role as UserRole,
      organizationName: orgName.trim() || (role === 'volunteer' ? 'Independent Courier' : 'Local Community Partner'),
      phone: phone.trim() || '+1 (555) 000-0000',
      address: address.trim() || 'Metro Area',
      city: 'Metro City',
      isVerified: false, // Must be verified by admin
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    switchRole(role);
    showToast('success', 'Registration Complete', `Welcome to RescuePlate as a ${role.toUpperCase()}! Verification request logged.`);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-14">
      <div className="bg-white rounded-3xl border border-sand-border p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest text-mint flex items-center justify-center mx-auto shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-forest">Join RescuePlate Network</h1>
          <p className="text-xs text-charcoal-muted">
            Register your organization or sign up as a volunteer courier.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('donor')}
              className={`p-3 rounded-xl border text-center transition-all ${
                role === 'donor'
                  ? 'bg-forest text-mint border-forest font-bold shadow-sm'
                  : 'bg-sand-subtle text-charcoal-muted border-sand-border hover:bg-sand-border/60'
              }`}
            >
              <Building2 className="w-4 h-4 mx-auto mb-1 text-primary" />
              <span className="text-xs block">Food Donor</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('recipient')}
              className={`p-3 rounded-xl border text-center transition-all ${
                role === 'recipient'
                  ? 'bg-forest text-mint border-forest font-bold shadow-sm'
                  : 'bg-sand-subtle text-charcoal-muted border-sand-border hover:bg-sand-border/60'
              }`}
            >
              <HeartHandshake className="w-4 h-4 mx-auto mb-1 text-primary" />
              <span className="text-xs block">Recipient Org</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('volunteer')}
              className={`p-3 rounded-xl border text-center transition-all ${
                role === 'volunteer'
                  ? 'bg-forest text-mint border-forest font-bold shadow-sm'
                  : 'bg-sand-subtle text-charcoal-muted border-sand-border hover:bg-sand-border/60'
              }`}
            >
              <Truck className="w-4 h-4 mx-auto mb-1 text-primary" />
              <span className="text-xs block">Volunteer</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-forest uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full px-3 py-2 rounded-xl border border-sand-border text-xs text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest uppercase mb-1">
                {role === 'volunteer' ? 'Affiliation (Optional)' : 'Organization Name *'}
              </label>
              <input
                type="text"
                required={role !== 'volunteer'}
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder={role === 'donor' ? 'e.g. City Bistro' : 'e.g. Hope Shelter'}
                className="w-full px-3 py-2 rounded-xl border border-sand-border text-xs text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest uppercase mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.org"
                className="w-full px-3 py-2 rounded-xl border border-sand-border text-xs text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest uppercase mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-sand-border text-xs text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest uppercase mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 rounded-xl border border-sand-border text-xs text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest uppercase mb-1">
                Operating Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
                className="w-full px-3 py-2 rounded-xl border border-sand-border text-xs text-charcoal"
              />
            </div>
          </div>

          {/* Security Safeguard Note */}
          <div className="bg-sand-subtle p-3 rounded-xl border border-sand-border flex items-start gap-2 text-[11px] text-charcoal-muted">
            <ShieldAlert className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>
              All organizations undergo moderation vetting before verified badge issuance. Administrative access is restricted to verified coordinators.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-soft transition-all flex items-center justify-center gap-1.5"
          >
            <span>Create Account & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-charcoal-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

