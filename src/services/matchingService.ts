import { FoodDonation, SmartMatchResult } from '../types';
import { RECIPIENT_ORGS_POOL } from '../data/seedData';

// Haversine formula to compute distance in km between two geo points
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal place
}

export function rankRecipientsForDonation(donation: FoodDonation): SmartMatchResult[] {
  const now = new Date().getTime();
  const deadlineTime = new Date(donation.collectionDeadline).getTime();
  const hoursLeft = Math.max(0, (deadlineTime - now) / (1000 * 60 * 60));

  // Approximate weight in kg for capacity checking if unit is servings/boxes
  let approxKg = donation.quantity;
  if (donation.unit === 'servings') approxKg = donation.quantity * 0.4;
  else if (donation.unit === 'boxes') approxKg = donation.quantity * 1.2;
  else if (donation.unit === 'trays') approxKg = donation.quantity * 2.5;

  const results: SmartMatchResult[] = RECIPIENT_ORGS_POOL.map((org) => {
    let score = 50; // baseline
    const reasons: string[] = [];
    const highlights: string[] = [];

    // 1. Distance Calculation & Scoring
    let distanceKm = 0;
    if (donation.pickupCoordinates && org.lat && org.lng) {
      distanceKm = calculateHaversineKm(
        donation.pickupCoordinates.lat,
        donation.pickupCoordinates.lng,
        org.lat,
        org.lng
      );

      if (distanceKm <= 3) {
        score += 25;
        highlights.push(`Immediate proximity (${distanceKm} km away)`);
        reasons.push(`Close transit radius minimizes carbon footprint and travel delay.`);
      } else if (distanceKm <= 7) {
        score += 15;
        highlights.push(`Moderate distance (${distanceKm} km)`);
        reasons.push(`Within standard city volunteer transit corridor.`);
      } else {
        score -= 10;
        reasons.push(`Extended distance (${distanceKm} km) requires coordinated transport.`);
      }
    } else {
      reasons.push(`Exact coordinates unavailable; using municipal district proximity.`);
    }

    // 2. Deadline Feasibility
    const canMeetDeadline = hoursLeft > 1.5;
    if (hoursLeft < 2) {
      // Urgent window: orgs with immediate volunteer hubs or close distance get prioritized
      if (distanceKm <= 4) {
        score += 10;
        highlights.push('Rapid Response Ready');
        reasons.push('Proximity makes rapid collection before deadline highly viable.');
      } else {
        score -= 20;
        reasons.push('Tight deadline may risk collection timeout at this distance.');
      }
    } else {
      score += 10;
      reasons.push(`Collection deadline (${Math.round(hoursLeft)} hrs remaining) allows safe pickup.`);
    }

    // 3. Capacity Compatibility
    if (org.capacityKg >= approxKg) {
      score += 15;
      highlights.push(`Sufficient capacity (${org.capacityKg} kg max)`);
      reasons.push(`Can comfortably intake the batch of ~${Math.round(approxKg)} kg without storage overflow.`);
    } else {
      score -= 25;
      reasons.push(`Intake warning: batch (~${Math.round(approxKg)} kg) exceeds intake capacity (${org.capacityKg} kg).`);
    }

    // 4. Food Category & Storage Alignment
    const isPreferredCategory = org.preferredCategories.includes(donation.category);
    if (isPreferredCategory) {
      score += 10;
      highlights.push(`Category match: ${donation.category}`);
      reasons.push(`Org actively distributes ${donation.category} to their clients.`);
    }

    const needsColdStorage = donation.storageRequirement.includes('Refrigerated') || donation.storageRequirement.includes('Frozen');
    if (needsColdStorage) {
      if (org.hasRefrigeration) {
        score += 10;
        highlights.push('Equipped with cold storage');
      } else {
        score -= 30;
        reasons.push('Lacks certified cold-chain refrigeration units for perishables.');
      }
    }

    // 5. Verification Status
    if (org.isVerified) {
      score += 10;
      highlights.push('Verified 501(c)(3) / Food Partner');
    } else {
      score -= 40;
      reasons.push('Pending administrative food-handling verification.');
    }

    // Constrain score between 5 and 99
    const finalScore = Math.max(5, Math.min(99, score));

    return {
      recipientId: org.id,
      recipientName: org.name,
      recipientType: org.type,
      distanceKm,
      compatibilityScore: finalScore,
      capacityKg: org.capacityKg,
      isVerified: org.isVerified,
      canMeetDeadline,
      reasons,
      highlights,
    };
  });

  // Sort descending by compatibility score
  return results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

