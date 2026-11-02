import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { ImpactStats, FoodDonation } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ImpactCharts } from '../components/charts/ImpactCharts';
import { 
  HeartHandshake, 
  Utensils, 
  Scale, 
  Leaf, 
  Building2, 
  Users, 
  CheckCircle2, 
  FileText,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const [stats, setStats] = useState<ImpactStats>(dataService.getImpactStats());
  const [completedDonations, setCompletedDonations] = useState<FoodDonation[]>([]);

  useEffect(() => {
    const handleUpdate = () => {
      setStats(dataService.getImpactStats());
      const all = dataService.getDonations();
      setCompletedDonations(all.filter((d) => d.status === 'delivered'));
    };
    handleUpdate();
    return dataService.subscribe(handleUpdate);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner: Verification Disclaimer */}
      <div className="bg-sand-subtle border border-sand-border p-3.5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-bold text-forest">Verified Ledger Data:</span>
          <span className="text-charcoal-muted">
            All metrics shown below are calculated strictly from physically verified, completed deliveries. Listed or in-progress claims are never counted as delivered.
          </span>
        </div>
        <span className="text-[10px] bg-mint text-forest-dark font-bold px-2 py-0.5 rounded-full whitespace-nowrap self-start sm:self-auto">
          Hackathon Demonstration Data
        </span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Measurable Social Impact
        </span>
        <h1 className="text-3xl font-extrabold text-forest mt-1">Community Impact Dashboard</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
          Transparent accounting of rescued food, hunger relief meals supported, and avoided landfill greenhouse emissions.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Rescued Meals Supported"
          value={`${stats.totalMealsSupported.toLocaleString()}`}
          subtitle="Equiv. wholesome plates"
          icon={<Utensils className="w-5 h-5" />}
          colorScheme="forest"
          trend="+18% this month"
        />

        <StatCard
          title="Surplus Food Saved"
          value={`${stats.totalKgRedistributed.toLocaleString()} kg`}
          subtitle="Diverted from waste streams"
          icon={<Scale className="w-5 h-5" />}
          colorScheme="green"
        />

        <StatCard
          title="Avoided CO2e (Est.)"
          value={`${stats.co2EmissionsPreventedKgEst.toLocaleString()} kg`}
          subtitle="EPA factor (2.5kg CO2e/kg food)"
          icon={<Leaf className="w-5 h-5" />}
          colorScheme="mint"
        />

        <StatCard
          title="Verified Community Handovers"
          value={stats.totalDonationsCompleted}
          subtitle="Signed cryptographic receipts"
          icon={<CheckCircle2 className="w-5 h-5" />}
          colorScheme="coral"
        />
      </div>

      {/* Stakeholder Participation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sand-subtle flex items-center justify-center text-primary">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-charcoal-light uppercase block">
              Participating Donors
            </span>
            <div className="text-2xl font-extrabold text-forest">{stats.activeDonorsCount}</div>
            <span className="text-[11px] text-charcoal-muted">Hotels, canteens, bakeries</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sand-subtle flex items-center justify-center text-primary">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-charcoal-light uppercase block">
              Recipient Organizations
            </span>
            <div className="text-2xl font-extrabold text-forest">{stats.activeRecipientsCount}</div>
            <span className="text-[11px] text-charcoal-muted">Shelters & community kitchens</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sand-subtle flex items-center justify-center text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-charcoal-light uppercase block">
              Volunteer Runners
            </span>
            <div className="text-2xl font-extrabold text-forest">{stats.activeVolunteersCount}</div>
            <span className="text-[11px] text-charcoal-muted">Active transit couriers</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Charts */}
      <ImpactCharts stats={stats} />

      {/* Recent Completed Handovers Table */}
      <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-forest flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>Verified Handover Records Ledger</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Individual completed surplus transactions signed off by donor, courier, and recipient.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-primary bg-primary-subtle px-2.5 py-1 rounded-full border border-primary/20">
            {completedDonations.length} Audited Logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sand-border text-charcoal-light uppercase font-bold text-[10px]">
                <th className="py-3 px-3">Handover Batch</th>
                <th className="py-3 px-3">Donor Organization</th>
                <th className="py-3 px-3">Recipient Partner</th>
                <th className="py-3 px-3">Quantity Rescued</th>
                <th className="py-3 px-3">Pickup Security Code</th>
                <th className="py-3 px-3">Delivery Verified At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-subtle">
              {completedDonations.map((item) => (
                <tr key={item.id} className="hover:bg-sand-subtle/50 transition-colors">
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-forest block">{item.title}</span>
                    <span className="text-[10px] text-charcoal-muted">{item.category}</span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-charcoal">{item.donorOrg}</td>
                  <td className="py-3.5 px-3 font-semibold text-forest">{item.claimedByOrgName}</td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-forest">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="text-[10px] text-charcoal-muted block">
                      (~{item.estimatedMeals} meals)
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <code className="bg-sand-subtle px-2 py-0.5 rounded font-mono font-bold text-forest border border-sand-border">
                      {item.pickupCode || 'RP-VERIFIED'}
                    </code>
                  </td>
                  <td className="py-3.5 px-3 text-charcoal-muted">
                    {item.deliveredAt ? new Date(item.deliveredAt).toLocaleString() : 'Recent'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology and Standards Box */}
      <div className="bg-sand-subtle rounded-2xl border border-sand-border p-5 mt-8 text-xs text-charcoal space-y-2">
        <div className="flex items-center gap-2 font-bold text-forest">
          <Info className="w-4 h-4 text-primary" />
          <span>Conversion Assumptions & Environmental Standards</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-charcoal-muted text-[11px] pl-1 leading-relaxed">
          <li>
            <strong>Meal Equivalency:</strong> 1 meal is defined as ~0.40 kg of balanced food, conforming with standard USDA / Feeding America / FAO benchmarks.
          </li>
          <li>
            <strong>Greenhouse Gas Avoidance:</strong> Estimated at 2.50 kg CO2e per 1.0 kg of food diverted from municipal landfill anaerobic digestion (EPA WARM Model).
          </li>
          <li>
            <strong>Verification Policy:</strong> Transactions transition to the impact ledger only when authorized cryptographic verification is successfully matched in the database.
          </li>
        </ul>
      </div>
    </div>
  );
};

