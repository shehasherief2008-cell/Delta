export type UserRole = 'donor' | 'recipient' | 'volunteer' | 'admin';

export type DonationStatus = 
  | 'available'
  | 'claimed'
  | 'pickup_scheduled'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'expired';

export type FoodCategory = 
  | 'Cooked Meals'
  | 'Bakery & Bread'
  | 'Fresh Produce'
  | 'Dairy & Refrigerated'
  | 'Packaged & Dry Goods'
  | 'Beverages';

export type DietaryType = 
  | 'Vegetarian'
  | 'Vegan'
  | 'Halal'
  | 'Kosher'
  | 'Gluten-Free'
  | 'Nut-Free'
  | 'Contains Dairy'
  | 'Standard / Mixed';

export type StorageRequirement = 
  | 'Room Temperature'
  | 'Refrigerated (0-4°C)'
  | 'Frozen (-18°C)'
  | 'Hot Holding (>60°C)'
  | 'Insulated Box / Carrier';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationName?: string;
  organizationType?: 'Restaurant' | 'Hotel' | 'Catering' | 'Hostel' | 'NGO' | 'Community Kitchen' | 'Volunteer Hub';
  phone?: string;
  address?: string;
  city?: string;
  isVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface FoodDonation {
  id: string;
  donorId: string;
  donorName: string;
  donorOrg: string;
  donorContact: string;
  title: string;
  category: FoodCategory;
  description: string;
  quantity: number;
  unit: 'kg' | 'servings' | 'boxes' | 'trays' | 'litres';
  estimatedMeals: number; // typically 1 serving or ~0.4kg per meal
  storageRequirement: StorageRequirement;
  dietaryClassification: DietaryType[];
  allergens: string[];
  preparedAt: string;
  availableFrom: string;
  collectionDeadline: string;
  pickupLocality: string;
  pickupAddress: string;
  pickupCoordinates?: { lat: number; lng: number };
  imageUrl: string;
  status: DonationStatus;
  specialInstructions?: string;
  safetyChecklistAcknowledged: boolean;
  isReported?: boolean;
  moderationStatus?: 'approved' | 'flagged' | 'suspended';
  claimedByOrgId?: string;
  claimedByOrgName?: string;
  claimedAt?: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  pickupCode?: string; // 6-digit code for verification
  collectedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface SmartMatchResult {
  recipientId: string;
  recipientName: string;
  recipientType: string;
  distanceKm: number;
  compatibilityScore: number; // 0 - 100
  capacityKg: number;
  isVerified: boolean;
  canMeetDeadline: boolean;
  reasons: string[];
  highlights: string[];
}

export interface ImpactStats {
  totalDonationsCompleted: number;
  totalKgRedistributed: number;
  totalMealsSupported: number;
  activeDonorsCount: number;
  activeRecipientsCount: number;
  activeVolunteersCount: number;
  co2EmissionsPreventedKgEst: number; // clearly documented estimate: 1kg food rescued ~ 2.5kg CO2e avoided
  categoryBreakdown: { category: FoodCategory; count: number; kg: number }[];
  monthlyTrends: { month: string; meals: number; kg: number; count: number }[];
}

export interface AuditLog {
  id: string;
  donationId?: string;
  action: string;
  actorName: string;
  actorRole: UserRole;
  details: string;
  timestamp: string;
}

export interface UserReport {
  id: string;
  targetId: string;
  targetType: 'donation' | 'organization' | 'user';
  reporterName: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

