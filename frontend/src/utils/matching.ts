import type { TailorProfile } from '../types';

export interface MatchingFilterOptions {
  userState: string;
  userDistrict: string;
  userVillage: string;
  selectedCategory?: string;
  maxEstDays?: number;
  maxPrice?: number;
  onlyAvailable?: boolean;
}

export interface TailorMatchResult {
  tailor: TailorProfile;
  matchTier: 'same_village' | 'nearby_area' | 'other';
  matchScore: number;
  distanceKmApprox: number;
  reasonEn: string;
  reasonHi: string;
}

export function filterAndRankTailors(
  tailors: TailorProfile[],
  options: MatchingFilterOptions
): TailorMatchResult[] {
  const { userState, userDistrict, userVillage, selectedCategory, maxEstDays, maxPrice, onlyAvailable } = options;

  return tailors
    .filter(t => t.isVerified) // Only verified tailors publicly visible
    .filter(t => {
      if (onlyAvailable && t.availability === 'unavailable') return false;
      if (t.currentActiveOrders >= t.maxActiveOrders) return false;
      if (maxEstDays && t.estCompletionDays > maxEstDays) return false;
      if (maxPrice && t.startingPrice > maxPrice) return false;
      return true;
    })
    .map(t => {
      const isSameVillage =
        t.state.toLowerCase() === userState.toLowerCase() &&
        t.district.toLowerCase() === userDistrict.toLowerCase() &&
        t.village.toLowerCase() === userVillage.toLowerCase();

      const isSameDistrict =
        t.state.toLowerCase() === userState.toLowerCase() &&
        t.district.toLowerCase() === userDistrict.toLowerCase();

      let matchTier: 'same_village' | 'nearby_area' | 'other' = 'other';
      let distanceKmApprox = 8.5;
      let score = 50;
      let reasonEn = 'Verified Tailor in your State';
      let reasonHi = 'आपके राज्य में सत्यापित दर्जी';

      if (isSameVillage) {
        matchTier = 'same_village';
        distanceKmApprox = 0.5;
        score = 100;
        reasonEn = `Same Village (${t.village}) - Highest Trust`;
        reasonHi = `आपके ही गाँव (${t.village}) से - सर्वोच्च भरोसा`;
      } else if (isSameDistrict) {
        matchTier = 'nearby_area';
        distanceKmApprox = 3.2;
        score = 80;
        reasonEn = `Nearby Village in ${t.district} (${t.village})`;
        reasonHi = `${t.district} का पास का गाँव (${t.village})`;
      }

      // Add availability bonus
      if (t.availability === 'available') score += 10;
      if (t.availability === 'limited') score += 5;

      // Add rating bonus
      score += t.rating * 2;

      // Category match bonus
      if (selectedCategory && t.servicesOffered.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()))) {
        score += 15;
      }

      return {
        tailor: t,
        matchTier,
        matchScore: score,
        distanceKmApprox,
        reasonEn,
        reasonHi
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
