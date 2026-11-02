import { FoodDonation, UserProfile, AuditLog, UserReport, ImpactStats, DonationStatus } from '../types';
import { SEED_DONATIONS, SEED_USERS, SEED_AUDIT_LOGS, SEED_REPORTS } from '../data/seedData';

const STORAGE_KEYS = {
  DONATIONS: 'rescueplate_donations_v1',
  USERS: 'rescueplate_users_v1',
  AUDIT: 'rescueplate_audit_v1',
  REPORTS: 'rescueplate_reports_v1',
  ACTIVE_USER: 'rescueplate_active_user_v1',
};

type Listener = () => void;

class DataService {
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(SEED_DONATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(SEED_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_USER)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(SEED_USERS[0])); // Marcus (Donor) default
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Error in listener notification', err);
      }
    });
  }

  // Active User / Role methods
  public getActiveUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return SEED_USERS[0];
  }

  public setActiveUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    this.notify();
  }

  public switchRole(role: UserProfile['role']) {
    const users = this.getUsers();
    const match = users.find((u) => u.role === role) || {
      id: `user-${role}-custom`,
      name: `Demo ${role.toUpperCase()}`,
      email: `${role}@demo.rescueplate.org`,
      role,
      organizationName: role === 'donor' ? 'City Kitchen Bistro' : role === 'recipient' ? 'St. Michael Shelter' : 'Metro Volunteer Network',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    this.setActiveUser(match);
  }

  public getUsers(): UserProfile[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) return JSON.parse(stored);
    } catch {}
    return SEED_USERS;
  }

  // Donation marketplace methods
  public getDonations(): FoodDonation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DONATIONS);
      if (stored) return JSON.parse(stored);
    } catch {}
    return SEED_DONATIONS;
  }

  public getDonationById(id: string): FoodDonation | undefined {
    return this.getDonations().find((d) => d.id === id);
  }

  public createDonation(donationData: Omit<FoodDonation, 'id' | 'createdAt' | 'status'>): FoodDonation {
    const donations = this.getDonations();
    const newDonation: FoodDonation = {
      ...donationData,
      id: `don-${Date.now().toString(36)}`,
      status: 'available',
      createdAt: new Date().toISOString(),
    };

    donations.unshift(newDonation);
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));

    this.logAudit({
      action: 'DONATION_CREATED',
      donationId: newDonation.id,
      actorName: newDonation.donorName,
      actorRole: 'donor',
      details: `Created listing "${newDonation.title}" with ${newDonation.quantity} ${newDonation.unit}.`,
    });

    this.notify();
    return newDonation;
  }

  public claimDonation(donationId: string, recipientUser: UserProfile): { success: boolean; message: string; pickupCode?: string } {
    const donations = this.getDonations();
    const target = donations.find((d) => d.id === donationId);

    if (!target) {
      return { success: false, message: 'Donation listing could not be found.' };
    }

    if (target.status !== 'available') {
      return { success: false, message: `This donation is no longer available (Current status: ${target.status}).` };
    }

    const now = new Date().getTime();
    const deadline = new Date(target.collectionDeadline).getTime();
    if (now > deadline) {
      target.status = 'expired';
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
      this.notify();
      return { success: false, message: 'The collection deadline for this listing has expired.' };
    }

    // Generate unique 6-character pickup verification code
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const pickupCode = `RP-${randomDigits}`;

    target.status = 'claimed';
    target.claimedByOrgId = recipientUser.id;
    target.claimedByOrgName = recipientUser.organizationName || recipientUser.name;
    target.claimedAt = new Date().toISOString();
    target.pickupCode = pickupCode;

    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));

    this.logAudit({
      action: 'DONATION_CLAIMED',
      donationId: target.id,
      actorName: recipientUser.name,
      actorRole: recipientUser.role,
      details: `Claimed by ${target.claimedByOrgName}. Verification security code issued: ${pickupCode}`,
    });

    this.notify();
    return { success: true, message: 'Donation claimed successfully!', pickupCode };
  }

  public assignVolunteer(donationId: string, volunteerUser: UserProfile): { success: boolean; message: string } {
    const donations = this.getDonations();
    const target = donations.find((d) => d.id === donationId);

    if (!target) return { success: false, message: 'Donation not found' };

    target.assignedVolunteerId = volunteerUser.id;
    target.assignedVolunteerName = volunteerUser.name;
    target.status = 'pickup_scheduled';

    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));

    this.logAudit({
      action: 'VOLUNTEER_ASSIGNED',
      donationId: target.id,
      actorName: volunteerUser.name,
      actorRole: 'volunteer',
      details: `Volunteer assigned to handle transport. Scheduled collection from ${target.donorOrg}.`,
    });

    this.notify();
    return { success: true, message: 'Volunteer scheduled for pickup task.' };
  }

  public verifyPickup(donationId: string, enteredCode: string, actor: UserProfile): { success: boolean; message: string } {
    const donations = this.getDonations();
    const target = donations.find((d) => d.id === donationId);

    if (!target) return { success: false, message: 'Listing not found.' };

    if (!['claimed', 'pickup_scheduled'].includes(target.status)) {
      return { success: false, message: `Invalid status transition: cannot pickup when status is "${target.status}".` };
    }

    const cleanInput = enteredCode.trim().toUpperCase();
    const actualCode = (target.pickupCode || '').trim().toUpperCase();

    if (cleanInput !== actualCode) {
      return { success: false, message: 'Invalid verification code. Please confirm with donor.' };
    }

    target.status = 'in_transit';
    target.collectedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));

    this.logAudit({
      action: 'PICKUP_VERIFIED',
      donationId: target.id,
      actorName: actor.name,
      actorRole: actor.role,
      details: `Pickup verified at donor location using code ${actualCode}. In transit to ${target.claimedByOrgName}.`,
    });

    this.notify();
    return { success: true, message: 'Pickup verified successfully! Batch is now in transit.' };
  }

  public confirmDelivery(donationId: string, actor: UserProfile): { success: boolean; message: string } {
    const donations = this.getDonations();
    const target = donations.find((d) => d.id === donationId);

    if (!target) return { success: false, message: 'Listing not found.' };

    if (target.status !== 'in_transit') {
      return { success: false, message: `Cannot confirm delivery while listing is in "${target.status}" status.` };
    }

    target.status = 'delivered';
    target.deliveredAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));

    this.logAudit({
      action: 'DELIVERY_CONFIRMED',
      donationId: target.id,
      actorName: actor.name,
      actorRole: actor.role,
      details: `Delivered to recipient organization ${target.claimedByOrgName}. Redistribution complete.`,
    });

    this.notify();
    return { success: true, message: 'Delivery completed! Impact statistics have been updated.' };
  }

  public cancelDonation(donationId: string, reason: string, actor: UserProfile): { success: boolean; message: string } {
    const donations = this.getDonations();
    const target = donations.find((d) => d.id === donationId);

    if (!target) return { success: false, message: 'Listing not found.' };

    target.status = 'cancelled';
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));

    this.logAudit({
      action: 'DONATION_CANCELLED',
      donationId: target.id,
      actorName: actor.name,
      actorRole: actor.role,
      details: `Donation cancelled: ${reason}`,
    });

    this.notify();
    return { success: true, message: 'Donation marked as cancelled.' };
  }

  public moderateDonation(donationId: string, moderationStatus: 'approved' | 'flagged' | 'suspended', admin: UserProfile): void {
    const donations = this.getDonations();
    const target = donations.find((d) => d.id === donationId);
    if (!target) return;

    target.moderationStatus = moderationStatus;
    if (moderationStatus === 'suspended') {
      target.status = 'cancelled';
    }

    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));

    this.logAudit({
      action: `MODERATION_${moderationStatus.toUpperCase()}`,
      donationId: target.id,
      actorName: admin.name,
      actorRole: 'admin',
      details: `Administrator set status to ${moderationStatus}`,
    });

    this.notify();
  }

  public reportListing(donationId: string, reporterName: string, reason: string, details: string) {
    const reports = this.getReports();
    const newReport: UserReport = {
      id: `rep-${Date.now().toString(36)}`,
      targetId: donationId,
      targetType: 'donation',
      reporterName,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

    const donations = this.getDonations();
    const target = donations.find((d) => d.id === donationId);
    if (target) {
      target.isReported = true;
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
    }

    this.notify();
  }

  public getReports(): UserReport[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (stored) return JSON.parse(stored);
    } catch {}
    return SEED_REPORTS;
  }

  public resolveReport(reportId: string, status: 'resolved' | 'dismissed') {
    const reports = this.getReports();
    const rep = reports.find((r) => r.id === reportId);
    if (rep) {
      rep.status = status;
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      this.notify();
    }
  }

  public getAuditLogs(): AuditLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT);
      if (stored) return JSON.parse(stored);
    } catch {}
    return SEED_AUDIT_LOGS;
  }

  private logAudit(entry: Omit<AuditLog, 'id' | 'timestamp'>) {
    const logs = this.getAuditLogs();
    logs.unshift({
      ...entry,
      id: `audit-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs.slice(0, 100)));
  }

  // Calculate Impact from completed transactions only
  public getImpactStats(): ImpactStats {
    const donations = this.getDonations();
    const delivered = donations.filter((d) => d.status === 'delivered');

    let totalKg = 0;
    let totalMeals = 0;

    delivered.forEach((d) => {
      totalMeals += d.estimatedMeals;
      if (d.unit === 'kg') totalKg += d.quantity;
      else if (d.unit === 'servings') totalKg += Math.round(d.quantity * 0.4);
      else if (d.unit === 'boxes') totalKg += Math.round(d.quantity * 1.2);
      else if (d.unit === 'trays') totalKg += Math.round(d.quantity * 2.5);
      else if (d.unit === 'litres') totalKg += Math.round(d.quantity * 1.03);
    });

    const donorsSet = new Set(delivered.map((d) => d.donorId));
    const recipientSet = new Set(delivered.map((d) => d.claimedByOrgId).filter(Boolean));
    const volunteerSet = new Set(delivered.map((d) => d.assignedVolunteerId).filter(Boolean));

    const categoryMap: Record<string, { count: number; kg: number }> = {};
    delivered.forEach((d) => {
      if (!categoryMap[d.category]) categoryMap[d.category] = { count: 0, kg: 0 };
      categoryMap[d.category].count += 1;
      let kg = d.quantity;
      if (d.unit === 'servings') kg = d.quantity * 0.4;
      categoryMap[d.category].kg += Math.round(kg);
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([category, val]) => ({
      category: category as FoodDonation['category'],
      count: val.count,
      kg: val.kg,
    }));

    return {
      totalDonationsCompleted: delivered.length,
      totalKgRedistributed: totalKg,
      totalMealsSupported: totalMeals,
      activeDonorsCount: Math.max(donorsSet.size, 1),
      activeRecipientsCount: Math.max(recipientSet.size, 1),
      activeVolunteersCount: Math.max(volunteerSet.size, 1),
      co2EmissionsPreventedKgEst: Math.round(totalKg * 2.5), // Standard EPA food waste emission factor: 2.5kg CO2e per 1kg surplus food rescued
      categoryBreakdown,
      monthlyTrends: [
        { month: 'Aug', meals: 180, kg: 72, count: 5 },
        { month: 'Sep', meals: 420, kg: 168, count: 12 },
        { month: 'Oct', meals: 680, kg: 272, count: 18 },
        { month: 'Nov', meals: totalMeals + 150, kg: totalKg + 60, count: delivered.length + 8 },
      ],
    };
  }

  // Reset Demo to fresh state
  public resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(SEED_DONATIONS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(SEED_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(SEED_USERS[0]));
    this.notify();
  }
}

export const dataService = new DataService();

