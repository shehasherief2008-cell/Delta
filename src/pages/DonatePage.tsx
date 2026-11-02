import React, { useState } from 'react';
import { useNavigate, Link } from '../lib/router';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dataService } from '../services/dataService';
import { FoodCategory, StorageRequirement, DietaryType, FoodDonation } from '../types';
import { 
  Utensils, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  Image as ImageIcon,
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';

const CATEGORIES: FoodCategory[] = [
  'Cooked Meals',
  'Bakery & Bread',
  'Fresh Produce',
  'Dairy & Refrigerated',
  'Packaged & Dry Goods',
  'Beverages',
];

const STORAGE_OPTIONS: StorageRequirement[] = [
  'Room Temperature',
  'Refrigerated (0-4°C)',
  'Frozen (-18°C)',
  'Hot Holding (>60°C)',
  'Insulated Box / Carrier',
];

const DIETARY_CHOICES: DietaryType[] = [
  'Vegetarian',
  'Vegan',
  'Halal',
  'Kosher',
  'Gluten-Free',
  'Nut-Free',
  'Standard / Mixed',
];

const SAMPLE_FOOD_PHOTOS = [
  { label: 'Buffet / Hot Meals', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Artisan Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fresh Produce', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80' },
  { label: 'Catering Trays', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
];

export const DonatePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Helper defaults
  const now = new Date();
  const defaultAvailable = new Date(now.getTime() - 30 * 60 * 1000).toISOString().slice(0, 16);
  const defaultDeadline = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const defaultPrepared = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Cooked Meals' as FoodCategory,
    description: '',
    quantity: 20,
    unit: 'servings' as FoodDonation['unit'],
    storageRequirement: 'Hot Holding (>60°C)' as StorageRequirement,
    dietaryClassification: ['Vegetarian'] as DietaryType[],
    allergens: 'Contains Dairy (Butter in sauce)',
    preparedAt: defaultPrepared,
    availableFrom: defaultAvailable,
    collectionDeadline: defaultDeadline,
    pickupLocality: 'Downtown Culinary District',
    pickupAddress: user.address || '450 Harbor Boulevard, Suite 100',
    specialInstructions: 'Enter through back loading dock door. Knock or call phone on arrival.',
    imageUrl: SAMPLE_FOOD_PHOTOS[0].url,
    safetyChecklistAcknowledged: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdListing, setCreatedListing] = useState<FoodDonation | null>(null);

  const handleDietaryToggle = (diet: DietaryType) => {
    setFormData((prev) => {
      const exists = prev.dietaryClassification.includes(diet);
      if (exists) {
        return {
          ...prev,
          dietaryClassification: prev.dietaryClassification.filter((d) => d !== diet),
        };
      } else {
        return {
          ...prev,
          dietaryClassification: [...prev.dietaryClassification, diet],
        };
      }
    });
  };

  const validate = () => {
    const err: Record<string, string> = {};

    if (!formData.title.trim()) {
      err.title = 'Title is required (e.g. 40 Bento Meal Trays)';
    }

    if (!formData.description.trim() || formData.description.length < 15) {
      err.description = 'Please provide a clear description (at least 15 characters).';
    }

    if (Number(formData.quantity) <= 0 || isNaN(Number(formData.quantity))) {
      err.quantity = 'Quantity must be a positive number.';
    }

    if (!formData.pickupAddress.trim()) {
      err.pickupAddress = 'Physical pickup address is required.';
    }

    if (!formData.pickupLocality.trim()) {
      err.pickupLocality = 'District or neighborhood locality is required.';
    }

    // Date validations
    const nowMs = Date.now();
    const deadlineMs = new Date(formData.collectionDeadline).getTime();
    const availableMs = new Date(formData.availableFrom).getTime();

    if (isNaN(deadlineMs) || isNaN(availableMs)) {
      err.collectionDeadline = 'Invalid date/time provided.';
    } else {
      if (deadlineMs <= nowMs) {
        err.collectionDeadline = 'Collection deadline must be in the future.';
      }
      if (deadlineMs <= availableMs) {
        err.collectionDeadline = 'Collection deadline must follow available-from time.';
      }
    }

    if (!formData.safetyChecklistAcknowledged) {
      err.safety = 'You must acknowledge the Food Safety & Good Samaritan declaration.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('error', 'Form Incomplete', 'Please correct highlighted errors before submitting.');
      return;
    }

    // Estimate meals
    let estMeals = Number(formData.quantity);
    if (formData.unit === 'kg') estMeals = Math.round(Number(formData.quantity) * 2.5);
    else if (formData.unit === 'boxes') estMeals = Math.round(Number(formData.quantity) * 3);
    else if (formData.unit === 'trays') estMeals = Math.round(Number(formData.quantity) * 6);

    const allergenList = formData.allergens
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newDonation = dataService.createDonation({
      donorId: user.id,
      donorName: user.name,
      donorOrg: user.organizationName || 'Verified Food Partner',
      donorContact: user.phone || '+1 (555) 234-5678',
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description.trim(),
      quantity: Number(formData.quantity),
      unit: formData.unit,
      estimatedMeals: estMeals,
      storageRequirement: formData.storageRequirement,
      dietaryClassification: formData.dietaryClassification,
      allergens: allergenList,
      preparedAt: new Date(formData.preparedAt).toISOString(),
      availableFrom: new Date(formData.availableFrom).toISOString(),
      collectionDeadline: new Date(formData.collectionDeadline).toISOString(),
      pickupLocality: formData.pickupLocality.trim(),
      pickupAddress: formData.pickupAddress.trim(),
      pickupCoordinates: { lat: 37.7749, lng: -122.4194 },
      imageUrl: formData.imageUrl,
      specialInstructions: formData.specialInstructions.trim(),
      safetyChecklistAcknowledged: true,
      moderationStatus: 'approved',
    });

    setCreatedListing(newDonation);
    showToast('success', 'Listing Published!', 'Your surplus food donation is now discoverable.');
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Success banner if newly published */}
      {createdListing ? (
        <div className="bg-white rounded-3xl border border-primary/30 p-8 shadow-card text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-mint text-forest-dark flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-forest">Donation Successfully Listed!</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto">
            "{createdListing.title}" with {createdListing.quantity} {createdListing.unit} has been saved to the active marketplace. Eligible community organizations and volunteers can now coordinate collection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to={`/donations/${createdListing.id}`}
              className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-soft transition-all"
            >
              View Listing Specification
            </Link>
            <Link
              to="/donations"
              className="w-full sm:w-auto px-5 py-2.5 bg-sand-subtle hover:bg-sand-border text-forest text-xs font-bold rounded-xl border border-sand-border transition-all"
            >
              Back to Marketplace
            </Link>
            <button
              onClick={() => {
                setCreatedListing(null);
                setFormData((prev) => ({ ...prev, title: '' }));
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-white text-charcoal-muted hover:text-charcoal text-xs font-semibold"
            >
              + List Another Batch
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Surplus Food Recovery
              </span>
              <span className="text-[10px] bg-mint text-forest-dark font-bold px-2 py-0.5 rounded-full">
                Zero Waste Protocol
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-forest mt-1">List Surplus Food Donation</h1>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
              Register commercial kitchen surplus with complete temperature, dietary, and allergen specifications to enable safe redistribution.
            </p>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Food Details Card */}
            <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft space-y-5">
              <h3 className="text-base font-bold text-forest border-b border-sand-subtle pb-3 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary" />
                <span>1. Surplus Food Description</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Food Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 45 Roasted Chicken Bento Trays with Quinoa"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-border bg-sand-subtle/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-charcoal"
                  />
                  {errors.title && <p className="text-xs text-coral-dark mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as FoodCategory })}
                    className="w-full px-3 py-2.5 rounded-xl border border-sand-border bg-white text-xs font-medium text-charcoal"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Storage Requirement *
                  </label>
                  <select
                    value={formData.storageRequirement}
                    onChange={(e) => setFormData({ ...formData, storageRequirement: e.target.value as StorageRequirement })}
                    className="w-full px-3 py-2.5 rounded-xl border border-sand-border bg-white text-xs font-medium text-charcoal"
                  >
                    {STORAGE_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Detailed Food Description *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Specify ingredients, container types, and temperature state..."
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-charcoal"
                  />
                  {errors.description && <p className="text-xs text-coral-dark mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-border bg-sand-subtle/30 text-sm font-bold text-forest"
                  />
                  {errors.quantity && <p className="text-xs text-coral-dark mt-1">{errors.quantity}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Unit of Measurement *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-sand-border bg-white text-xs font-medium text-charcoal"
                  >
                    <option value="servings">servings (prepared meals)</option>
                    <option value="kg">kg (weight)</option>
                    <option value="boxes">boxes</option>
                    <option value="trays">catering trays</option>
                    <option value="litres">litres</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Dietary & Safety Card */}
            <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft space-y-5">
              <h3 className="text-base font-bold text-forest border-b border-sand-subtle pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>2. Dietary & Allergen Safety</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-2">
                  Dietary Classification (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_CHOICES.map((diet) => {
                    const isSelected = formData.dietaryClassification.includes(diet);
                    return (
                      <button
                        type="button"
                        key={diet}
                        onClick={() => handleDietaryToggle(diet)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-sand-subtle text-charcoal-muted border-sand-border hover:bg-sand-border/70'
                        }`}
                      >
                        {diet}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                  Allergen Declarations
                </label>
                <input
                  type="text"
                  value={formData.allergens}
                  onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                  placeholder="e.g. Milk, Wheat, Peanuts (or 'None reported')"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal"
                />
              </div>

              {/* Photo Selector */}
              <div>
                <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-2">
                  Food Photo Reference
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SAMPLE_FOOD_PHOTOS.map((photo) => {
                    const isSelected = formData.imageUrl === photo.url;
                    return (
                      <div
                        key={photo.url}
                        onClick={() => setFormData({ ...formData, imageUrl: photo.url })}
                        className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected ? 'border-primary ring-2 ring-primary/20 scale-102' : 'border-sand-border opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={photo.url} alt={photo.label} className="w-full h-20 object-cover" />
                        <span className="block text-[10px] text-center py-1 font-semibold text-charcoal bg-white truncate px-1">
                          {photo.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Logistics, Schedule & Pickup Card */}
            <div className="bg-white rounded-2xl border border-sand-border p-6 shadow-soft space-y-5">
              <h3 className="text-base font-bold text-forest border-b border-sand-subtle pb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>3. Timing & Pickup Location</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Preparation Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.preparedAt}
                    onChange={(e) => setFormData({ ...formData, preparedAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Available From *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.availableFrom}
                    onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Collection Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.collectionDeadline}
                    onChange={(e) => setFormData({ ...formData, collectionDeadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal"
                  />
                  {errors.collectionDeadline && (
                    <p className="text-xs text-coral-dark mt-1">{errors.collectionDeadline}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Physical Pickup Address *
                  </label>
                  <input
                    type="text"
                    value={formData.pickupAddress}
                    onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                    placeholder="Street address, building number, dock designation"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal"
                  />
                  {errors.pickupAddress && <p className="text-xs text-coral-dark mt-1">{errors.pickupAddress}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    District Locality *
                  </label>
                  <input
                    type="text"
                    value={formData.pickupLocality}
                    onChange={(e) => setFormData({ ...formData, pickupLocality: e.target.value })}
                    placeholder="e.g. Downtown Harbor District"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal"
                  />
                  {errors.pickupLocality && <p className="text-xs text-coral-dark mt-1">{errors.pickupLocality}</p>}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Special Handover / Loading Instructions
                  </label>
                  <input
                    type="text"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    placeholder="e.g. Bring insulated cambro boxes; park in loading dock spot #3"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-border bg-sand-subtle/30 text-xs text-charcoal"
                  />
                </div>
              </div>
            </div>

            {/* 4. Good Samaritan & Food Safety Declaration */}
            <div className="bg-sand-subtle rounded-2xl border border-sand-border p-6 space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="safetyChecklist"
                  checked={formData.safetyChecklistAcknowledged}
                  onChange={(e) =>
                    setFormData({ ...formData, safetyChecklistAcknowledged: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 text-primary rounded border-sand-border focus:ring-primary"
                />
                <label htmlFor="safetyChecklist" className="text-xs text-charcoal leading-relaxed cursor-pointer">
                  <strong className="text-forest block mb-0.5">
                    Food Safety & Good Samaritan Affirmation
                  </strong>
                  I certify that this food was prepared and held under sanitary conditions in accordance with standard food hygiene guidelines (HACCP). The food has not been previously served to customers and has remained within safe temperature boundaries. Both donor and recipient are protected under the Bill Emerson Good Samaritan Food Donation Act.
                </label>
              </div>
              {errors.safety && <p className="text-xs text-coral-dark font-medium pl-7">{errors.safety}</p>}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                to="/donations"
                className="px-5 py-2.5 text-xs font-semibold text-charcoal-muted hover:text-charcoal"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-soft transition-all transform active:scale-95 flex items-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Publish Surplus Food Listing</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

