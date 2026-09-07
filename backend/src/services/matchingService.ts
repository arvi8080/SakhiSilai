export interface TailorLocationData {
  id: string;
  name: string;
  state: string;
  district: string;
  village: string;
  availability: 'available' | 'limited' | 'unavailable';
  maxActiveOrders: number;
  currentActiveOrders: number;
  rating: number;
  isVerified: boolean;
  servicesOffered: string[];
}

export function computeHyperlocalMatches(
  tailors: TailorLocationData[],
  userState: string,
  userDistrict: string,
  userVillage: string
) {
  return tailors
    .filter(t => t.isVerified && t.currentActiveOrders < t.maxActiveOrders && t.availability !== 'unavailable')
    .map(t => {
      const isSameVillage =
        t.state.toLowerCase() === userState.toLowerCase() &&
        t.district.toLowerCase() === userDistrict.toLowerCase() &&
        t.village.toLowerCase() === userVillage.toLowerCase();

      const isSameDistrict =
        t.state.toLowerCase() === userState.toLowerCase() &&
        t.district.toLowerCase() === userDistrict.toLowerCase();

      let score = 50;
      let tier = 'other';
      let estDistanceKm = 8.5;

      if (isSameVillage) {
        tier = 'same_village';
        score = 100;
        estDistanceKm = 0.5;
      } else if (isSameDistrict) {
        tier = 'nearby_area';
        score = 80;
        estDistanceKm = 3.2;
      }

      if (t.availability === 'available') score += 10;
      score += t.rating * 2;

      return {
        tailor: t,
        tier,
        score,
        estDistanceKm
      };
    })
    .sort((a, b) => b.score - a.score);
}
