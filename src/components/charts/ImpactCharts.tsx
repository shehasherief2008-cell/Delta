import React from 'react';
import { FoodCategory, ImpactStats } from '../../types';
import { Utensils, Package, TrendingUp, Sparkles, Scale } from 'lucide-react';

interface ImpactChartsProps {
  stats: ImpactStats;
}

export const ImpactCharts: React.FC<ImpactChartsProps> = ({ stats }) => {
  // Max meal value for scaling monthly bars
  const maxMeals = Math.max(...stats.monthlyTrends.map((t) => t.meals), 100);

  // Category color mapping
  const categoryColors: Record<FoodCategory, { bar: string; text: string; bg: string }> = {
    'Cooked Meals': { bar: '#27835D', text: 'text-primary', bg: 'bg-primary' },
    'Bakery & Bread': { bar: '#D97706', text: 'text-amber-700', bg: 'bg-amber-600' },
    'Fresh Produce': { bar: '#16A34A', text: 'text-emerald-700', bg: 'bg-emerald-600' },
    'Dairy & Refrigerated': { bar: '#0284C7', text: 'text-sky-700', bg: 'bg-sky-600' },
    'Packaged & Dry Goods': { bar: '#9333EA', text: 'text-purple-700', bg: 'bg-purple-600' },
    'Beverages': { bar: '#F28B75', text: 'text-coral-dark', bg: 'bg-coral' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-forest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Monthly Meals Redistributed</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Verified community meal distributions across participating regions
            </p>
          </div>
          <span className="text-[11px] font-semibold bg-primary-subtle text-primary px-2.5 py-1 rounded-full border border-primary/20">
            Growth: +32% MoM
          </span>
        </div>

        {/* SVG/CSS Bar Chart */}
        <div className="h-56 flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-sand-border">
          {stats.monthlyTrends.map((item, idx) => {
            const heightPercent = Math.round((item.meals / maxMeals) * 80) + 15;
            const isLatest = idx === stats.monthlyTrends.length - 1;

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-forest mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.meals}
                </span>
                <div
                  className={`w-full rounded-t-xl transition-all duration-700 relative overflow-hidden ${
                    isLatest
                      ? 'bg-gradient-to-t from-primary to-primary-light shadow-md'
                      : 'bg-mint/80 hover:bg-mint transition-colors'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-white/40" />
                </div>
                <span className={`text-xs mt-2.5 font-semibold ${isLatest ? 'text-primary' : 'text-charcoal-muted'}`}>
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-charcoal-muted">
          <span>Source: Completed handovers database</span>
          <span className="font-semibold text-forest">Updated real-time</span>
        </div>
      </div>

      {/* Category Distribution Breakdown */}
      <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-forest flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <span>Surplus Redistribution by Food Category</span>
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Breakdown of food types safely intake by verified partners
              </p>
            </div>
            <span className="text-[11px] font-semibold bg-sand-subtle text-forest px-2.5 py-1 rounded-full border border-sand-border">
              {stats.categoryBreakdown.length} Active Categories
            </span>
          </div>

          {/* Category Progress Bars */}
          <div className="space-y-3.5 mt-5">
            {stats.categoryBreakdown.map((item) => {
              const totalKg = stats.totalKgRedistributed || 1;
              const pct = Math.max(5, Math.round((item.kg / totalKg) * 100));
              const color = categoryColors[item.category] || { bar: '#27835D', text: 'text-primary', bg: 'bg-primary' };

              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${color.bg}`} />
                      {item.category}
                    </span>
                    <span className="font-bold text-forest">
                      {item.kg} kg <span className="text-charcoal-light font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-sand-subtle rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color.bg} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Methodology Footer Note */}
        <div className="mt-5 pt-3.5 border-t border-sand-subtle flex items-start gap-2 text-[11px] text-charcoal-muted leading-relaxed">
          <Scale className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
          <span>
            <strong>Calculation Methodology:</strong> Standard meal equivalence benchmarked at 0.40 kg / portion based on Food and Agriculture Organization (FAO) food rescue guidelines.
          </span>
        </div>
      </div>
    </div>
  );
};

