import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  Sparkles,
  Layers
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, role, switchRole, setUser, resetDemoData } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    organizationName: user.organizationName || '',
    address: user.address || '',
    city: user.city || '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      organizationName: formData.organizationName,
      address: formData.address,
      city: formData.city,
    });
    setIsEditing(false);
    showToast('success', 'Profile Updated', 'Your profile details have been saved locally.');
  };

  const roles: { id: UserRole; title: string; desc: string }[] = [
    { id: 'donor', title: 'Food Donor', desc: 'Hotel, Restaurant, Hostel or Catering Kitchen' },
    { id: 'recipient', title: 'Recipient Org', desc: '501(c)(3) Community Kitchen, Shelter, or Food Pantry' },
    { id: 'volunteer', title: 'Volunteer Runner', desc: 'Authorized local transport and transit courier' },
    { id: 'admin', title: 'Platform Admin', desc: 'Compliance auditor and listings moderator' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          User Account & Role Settings
        </span>
        <h1 className="text-3xl font-extrabold text-forest mt-1">Profile Management</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
          Manage your organization credentials, contact details, and test different platform personas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-sand-border p-6 shadow-soft text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user.name}
              className="w-full h-full rounded-2xl object-cover border-2 border-primary/20 shadow-sm"
            />
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-mint text-forest-dark p-1 rounded-full shadow border border-mint-dark">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-forest">{user.name}</h3>
            <p className="text-xs text-charcoal-muted">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forest text-mint text-[11px] font-bold uppercase tracking-wider">
              {role}
            </div>
          </div>

          <div className="pt-4 border-t border-sand-subtle text-xs text-charcoal-muted text-left space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="truncate">{user.organizationName || 'No Organization'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>{user.phone || 'Phone not set'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="truncate">{user.city || 'Metro City'}</span>
            </div>
          </div>
        </div>

        {/* Details & Role Switcher */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Role Switcher Box for Judges */}
          <div className="bg-sand-subtle rounded-2xl border border-sand-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-forest">
                  Active Platform Role (Judge Switcher)
                </h3>
              </div>
              <span className="text-[10px] text-charcoal-light font-medium">Instant simulation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {roles.map((r) => {
                const isActive = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => switchRole(r.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                      isActive
                        ? 'bg-forest text-white border-forest shadow-sm'
                        : 'bg-white text-charcoal border-sand-border hover:border-primary/40'
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-bold block ${isActive ? 'text-mint' : 'text-forest'}`}>
                        {r.title}
                      </span>
                      <span className={`text-[10px] block mt-0.5 line-clamp-1 ${isActive ? 'text-sand/70' : 'text-charcoal-muted'}`}>
                        {r.desc}
                      </span>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-mint flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-forest">Contact & Organization Credentials</h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-primary hover:text-primary-hover"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Details'}
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase mb-1">Email</label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase mb-1">Organization</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal disabled:opacity-60"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-forest uppercase mb-1">Street Address</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal disabled:opacity-60"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-soft"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

