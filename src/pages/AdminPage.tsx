import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dataService } from '../services/dataService';
import { FoodDonation, UserReport, AuditLog } from '../types';
import { StatusBadge } from '../components/common/Badge';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  FileText, 
  Building2, 
  Ban, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user, role } = useAuth();
  const { showToast } = useToast();

  const [donations, setDonations] = useState<FoodDonation[]>(dataService.getDonations());
  const [reports, setReports] = useState<UserReport[]>(dataService.getReports());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(dataService.getAuditLogs());
  const [activeTab, setActiveTab] = useState<'listings' | 'reports' | 'audit'>('listings');

  useEffect(() => {
    const handleUpdate = () => {
      setDonations(dataService.getDonations());
      setReports(dataService.getReports());
      setAuditLogs(dataService.getAuditLogs());
    };
    return dataService.subscribe(handleUpdate);
  }, []);

  const handleModerate = (donationId: string, status: 'approved' | 'suspended') => {
    dataService.moderateDonation(donationId, status, user);
    showToast('info', 'Status Updated', `Donation has been set to ${status}.`);
  };

  const handleResolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    dataService.resolveReport(reportId, status);
    showToast('info', 'Report Updated', `Report marked as ${status}.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Protected Banner */}
      <div className="bg-forest-dark text-sand-subtle rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-coral bg-coral-dark/20 px-2.5 py-0.5 rounded-full border border-coral/30">
              Administrative Control Panel
            </span>
            <span className="text-xs text-sand/70">&bull; Hackathon Moderation Sandbox</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Platform Moderation & Trust Center
          </h1>
          <p className="text-xs sm:text-sm text-sand/80 mt-1 max-w-xl">
            Audit user reports, suspend unsafe or non-compliant food listings, and verify recipient organization credentials.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-forest p-3 rounded-2xl border border-forest-light text-xs text-mint">
          <ShieldCheck className="w-5 h-5 text-mint" />
          <div>
            <span className="font-bold block">Administrator Mode</span>
            <span className="text-[11px] text-sand/70">Authenticated as {user.name}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-sand-border pb-3">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'listings'
              ? 'bg-forest text-mint shadow-sm'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-sand-subtle'
          }`}
        >
          All Listings Moderation ({donations.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-forest text-mint shadow-sm'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-sand-subtle'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-coral" />
          <span>User Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'bg-forest text-mint shadow-sm'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-sand-subtle'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Complete Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab: Listings Moderation */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-forest">Food Listing Moderation Queue</h3>
            <span className="text-xs text-charcoal-muted">Suspend or approve public batches</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand-border text-charcoal-light uppercase font-bold text-[10px]">
                  <th className="py-3 px-3">Listing Details</th>
                  <th className="py-3 px-3">Donor Organization</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Moderation</th>
                  <th className="py-3 px-3 text-right">Moderator Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-subtle">
                {donations.map((item) => (
                  <tr key={item.id} className="hover:bg-sand-subtle/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-forest block">{item.title}</span>
                      <span className="text-[10px] text-charcoal-muted">
                        {item.quantity} {item.unit} &bull; {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-charcoal">{item.donorOrg}</td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.moderationStatus === 'suspended'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.moderationStatus || 'approved'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      {item.moderationStatus !== 'suspended' ? (
                        <button
                          onClick={() => handleModerate(item.id, 'suspended')}
                          className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold text-[11px] border border-red-200 transition-colors"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModerate(item.id, 'approved')}
                          className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-[11px] border border-emerald-200 transition-colors"
                        >
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: User Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-forest">Community Safety Flags & Reports</h3>

          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-xl border border-sand-border bg-sand-subtle/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-forest text-sm">{rep.reason}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          rep.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted mt-1">{rep.details}</p>
                    <span className="text-[10px] text-charcoal-light mt-1 block">
                      Reported by {rep.reporterName} on {new Date(rep.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {rep.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'resolved')}
                        className="px-3 py-1.5 bg-forest text-white text-xs font-bold rounded-lg hover:bg-forest-light transition-colors"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'dismissed')}
                        className="px-3 py-1.5 bg-sand-border text-charcoal text-xs font-semibold rounded-lg hover:bg-sand-border/80 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-charcoal-muted py-6 text-center">No active reports.</p>
          )}
        </div>
      )}

      {/* Tab: Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-forest">System Cryptographic Audit Log</h3>
          <div className="divide-y divide-sand-subtle text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <code className="text-[11px] font-mono font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">
                      {log.action}
                    </code>
                    <span className="font-bold text-forest">{log.actorName}</span>
                    <span className="text-[10px] uppercase bg-sand-subtle px-1.5 py-0.2 rounded text-charcoal-muted">
                      {log.actorRole}
                    </span>
                  </div>
                  <p className="text-charcoal-muted mt-1">{log.details}</p>
                </div>
                <span className="text-[11px] text-charcoal-light whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

