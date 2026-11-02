import React from 'react';
import { FoodCategory, DietaryType } from '../../types';
import { Search, RotateCcw, Filter, SlidersHorizontal } from 'lucide-react';

interface FiltersState {
  search: string;
  category: string;
  dietary: string;
  sortBy: 'deadline' | 'newest' | 'quantity';
  availableOnly: boolean;
}

interface DonationFiltersProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
  totalResults: number;
}

const CATEGORIES: ('All' | FoodCategory)[] = [
  'All',
  'Cooked Meals',
  'Bakery & Bread',
  'Fresh Produce',
  'Dairy & Refrigerated',
  'Packaged & Dry Goods',
];

const DIETARY_OPTIONS: ('All' | DietaryType)[] = [
  'All',
  'Vegetarian',
  'Vegan',
  'Halal',
  'Gluten-Free',
  'Nut-Free',
];

export const DonationFilters: React.FC<DonationFiltersProps> = ({
  filters,
  onChange,
  totalResults,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (category: string) => {
    onChange({ ...filters, category });
  };

  const handleDietaryChange = (dietary: string) => {
    onChange({ ...filters, dietary });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sortBy: e.target.value as FiltersState['sortBy'] });
  };

  const handleAvailabilityToggle = () => {
    onChange({ ...filters, availableOnly: !filters.availableOnly });
  };

  const handleReset = () => {
    onChange({
      search: '',
      category: 'All',
      dietary: 'All',
      sortBy: 'deadline',
      availableOnly: true,
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.dietary !== 'All' ||
    filters.sortBy !== 'deadline' ||
    !filters.availableOnly;

  return (
    <div className="bg-white rounded-2xl border border-sand-border p-5 shadow-soft mb-8 space-y-4">
      {/* Search Bar & Primary Controls */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by food title, restaurant name, or locality..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-border bg-sand-subtle/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-charcoal"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-charcoal-muted">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="py-2 px-3 rounded-xl border border-sand-border bg-white text-xs font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="deadline">Sort: Urgent Deadline First</option>
              <option value="newest">Sort: Newly Listed</option>
              <option value="quantity">Sort: Highest Quantity</option>
            </select>
          </div>

          {/* Availability Toggle */}
          <button
            onClick={handleAvailabilityToggle}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              filters.availableOnly
                ? 'bg-mint text-forest-dark border-mint-dark'
                : 'bg-sand-subtle text-charcoal-muted border-sand-border'
            }`}
          >
            <span>{filters.availableOnly ? 'Active Available Only' : 'All Listings'}</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="py-2 px-2.5 text-xs text-coral-dark hover:bg-coral-light rounded-xl transition-colors flex items-center gap-1"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-charcoal-muted mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-primary" /> Category:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-forest text-mint font-semibold shadow-sm'
                    : 'bg-sand-subtle text-charcoal-muted hover:text-charcoal hover:bg-sand-border/70'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dietary Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-sand-subtle">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-semibold text-charcoal-muted mr-1">Dietary:</span>
          {DIETARY_OPTIONS.map((diet) => {
            const isSelected = filters.dietary === diet;
            return (
              <button
                key={diet}
                onClick={() => handleDietaryChange(diet)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary text-white font-semibold'
                    : 'bg-sand-subtle text-charcoal-muted hover:bg-sand-border/60'
                }`}
              >
                {diet}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-charcoal-muted font-medium">
          Showing <span className="text-forest font-bold">{totalResults}</span> surplus listings
        </div>
      </div>
    </div>
  );
};

