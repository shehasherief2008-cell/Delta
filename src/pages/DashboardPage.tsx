import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { FoodDonation, AuditLog, ImpactStats } from '../types';
import { Link } from '../lib/router';
import { StatusBadge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { 
  Building2, 
  Utensils, 
  Truck, 
  HeartHandshake, 
  ShieldCheck, 
  PlusCircle, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Layers,
  Search,
  Sparkles
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const [donations, setDonations] = useState<FoodDonation[]>(dataService.getDonations());
  const [stats, setStats] = useState<ImpactStats>(dataService.getImpactStats());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(dataService.getAuditLogs());

  useEffect(() => {
    const handleUpdate = () => {
      setDonations(dataService.getDonations());
      setStats(dataService.getImpactStats());
      setAuditLogs(dataService.getAuditLogs());
    };
    return dataService.subscribe(handleUpdate);
  }, []);

  // Filter listings based on current persona role
  const donorListings = donations.filter((d) => d.donorId === user.id || d.donorOrg === user.organizationName);
  const recipientClaims = donations.filter((d) => d.claimedByOrgId === user.id || d.claimedByOrgName === user.organizationName);
  const volunteerTasks = donations.filter((d) => d.assignedVolunteerId === user.id || ['claimed', 'pickup_scheduled'].includes(d.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome Card */}
      <div className="bg-forest text-sand-subtle rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-mint bg-forest-dark/80 px-2.5 py-0.5 rounded-full border border-forest-light">
              Active Dashboard &bull; {role.toUpperCase()}
            </span>
            <span className="text-xs text-sand/70">&bull; {user.organizationName || 'Individual Partner'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-sand/80 max-w-xl">
            {role === 'donor' && 'Track surplus food listings, manage collection security codes, and audit meals redistributed.'}
            {role === 'recipient' && 'Review your claimed donations, monitor scheduled pickups, and manage community meal intake.'}
            {role === 'volunteer' && 'Pick up tasks across city routes, verify collections with donors, and complete deliveries.'}
            {role === 'admin' && 'Moderate public listings, process organization accreditation requests, and audit logs.'}
          </p>
        </div>

        {/* Quick CTA button */}
        <div className="flex items-center gap-3 relative z-10 self-stretch md:self-auto">
          {role === 'donor' && (
            <Link
              to="/donate"
              className="w-full md:w-auto px-5 py-3 bg-mint hover:bg-mint-dark text-forest-dark text-xs font-bold rounded-xl shadow-soft flex items-center justify-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Surplus Food</span>
            </Link>
          )}

          {role === 'recipient' && (
            <Link
              to="/donations"
              className="w-full md:w-auto px-5 py-3 bg-mint hover:bg-mint-dark text-forest-dark text-xs font-bold rounded-xl shadow-soft flex items-center justify-center gap-2 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Browse Live Marketplace</span>
            </Link>
          )}

          {role === 'volunteer' && (
            <Link
              to="/pickups"
              className="w-full md:w-auto px-5 py-3 bg-mint hover:bg-mint-dark text-forest-dark text-xs font-bold rounded-xl shadow-soft flex items-center justify-center gap-2 transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>Open Pickup Tasks</span>
            </Link>
          )}

          {role === 'admin' && (
            <Link
              to="/admin"
              className="w-full md:w-auto px-5 py-3 bg-coral hover:bg-coral-dark text-white text-xs font-bold rounded-xl shadow-soft flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administrative Moderation</span>
            </Link>
          )}
        </div>
      </div>

      {/* Role-Specific Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Rescued Meals"
          value={stats.totalMealsSupported}
          subtitle="Community nutrition impact"
          icon={<Utensils className="w-5 h-5" />}
          colorScheme="forest"
        />

        <StatCard
          title={role === 'donor' ? 'Active Listings' : role === 'recipient' ? 'Claimed Batches' : 'Transit Tasks'}
          value={
            role === 'donor'
              ? donorListings.filter((d) => d.status === 'available').length
              : role === 'recipient'
              ? recipientClaims.length
              : volunteerTasks.length
          }
          subtitle="Currently active"
          icon={<Layers className="w-5 h-5" />}
          colorScheme="green"
        />

        <StatCard
          title="Redistributed Food"
          value={`${stats.totalKgRedistributed} kg`}
          subtitle="Diverted from waste"
          icon={<Truck className="w-5 h-5" />}
          colorScheme="mint"
        />

        <StatCard
          title="Verification Status"
          value={user.isVerified ? 'Accredited' : 'Pending'}
          subtitle="HACCP & Trust compliance"
          icon={<ShieldCheck className="w-5 h-5" />}
          colorScheme="coral"
        />
      </div>

      {/* Role-Specific Content Area */}
      {role === 'donor' && (
        <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-forest">Your Surplus Listings ({donorListings.length})</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Manage your active batches, verify collection security codes, and check delivery status.
              </p>
            </div>
            <Link
              to="/donate"
              className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
            >
              <span>+ New Listing</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand-border text-charcoal-light uppercase font-bold text-[10px]">
                  <th className="py-3 px-3">Title & Category</th>
                  <th className="py-3 px-3">Quantity</th>
                  <th className="py-3 px-3">Deadline</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Handover Code</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-subtle">
                {donorListings.map((item) => (
                  <tr key={item.id} className="hover:bg-sand-subtle/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-forest block">{item.title}</span>
                      <span className="text-[10px] text-charcoal-muted">{item.category}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-charcoal">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3.5 px-3 text-charcoal-muted">
                      {new Date(item.collectionDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3">
                      {item.pickupCode ? (
                        <code className="bg-sand-subtle px-2 py-0.5 rounded font-mono font-bold text-forest border border-sand-border">
                          {item.pickupCode}
                        </code>
                      ) : (
                        <span className="text-charcoal-light text-[10px]">Pending Claim</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to={`/donations/${item.id}`}
                        className="text-primary font-bold hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {role === 'recipient' && (
        <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-forest">Your Claimed Donations ({recipientClaims.length})</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Surplus batches claimed by {user.organizationName || 'your organization'}.
              </p>
            </div>
            <Link
              to="/donations"
              className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
            >
              <span>Explore More Donations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand-border text-charcoal-light uppercase font-bold text-[10px]">
                  <th className="py-3 px-3">Food Title</th>
                  <th className="py-3 px-3">Donor Venue</th>
                  <th className="py-3 px-3">Quantity</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Pickup Code</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-subtle">
                {recipientClaims.map((item) => (
                  <tr key={item.id} className="hover:bg-sand-subtle/50 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-forest">{item.title}</td>
                    <td className="py-3.5 px-3 text-charcoal">{item.donorOrg}</td>
                    <td className="py-3.5 px-3 font-semibold text-charcoal">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3">
                      <code className="bg-mint/40 px-2 py-0.5 rounded font-mono font-bold text-forest border border-mint">
                        {item.pickupCode || 'N/A'}
                      </code>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link to="/pickups" className="text-primary font-bold hover:underline">
                        Track Delivery
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {role === 'volunteer' && (
        <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-forest">Active Volunteer Routes & Tasks</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Surplus batches awaiting transit or currently on the road.
              </p>
            </div>
            <Link
              to="/pickups"
              className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
            >
              <span>Manage Pickups</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {volunteerTasks.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-sand-border bg-sand-subtle/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-forest text-sm">{item.title}</span>
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <div className="text-xs text-charcoal-muted">
                  <strong>Route:</strong> {item.donorOrg} &rarr; {item.claimedByOrgName || 'Pending Recipient'}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-sand-border text-xs">
                  <span className="font-semibold text-charcoal">
                    {item.quantity} {item.unit} (~{item.estimatedMeals} meals)
                  </span>
                  <Link to="/pickups" className="text-primary font-bold hover:underline">
                    Enter Code / Update &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Recent Audit Activity */}
      <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-forest flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Recent Platform Activity Log</span>
          </h3>
          <span className="text-[10px] bg-sand-subtle text-charcoal-muted px-2 py-0.5 rounded font-mono">
            Audited Ledger
          </span>
        </div>

        <div className="divide-y divide-sand-subtle text-xs">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
              <div>
                <span className="font-semibold text-forest">{log.actorName}</span>{' '}
                <span className="text-charcoal-muted">({log.actorRole}):</span>{' '}
                <span className="text-charcoal">{log.details}</span>
              </div>
              <span className="text-[11px] text-charcoal-light whitespace-nowrap">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

