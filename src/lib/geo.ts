import { SITE } from "./site-config";

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** مسافة بالكيلومتر بين نقطتين (Haversine) */
export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} م`;
  if (km < 10) return `${km.toFixed(1)} كم`;
  return `${Math.round(km)} كم`;
}

export function distanceToGymKm(userLat: number, userLon: number): number {
  return distanceKm(userLat, userLon, SITE.latitude, SITE.longitude);
}

/**
 * توجيه من موقعك الحالي → القاعة.
 * ما كنحددوش origin باش Google Maps ياخد GPS الحقيقي ديالك فالتطبيق.
 */
export function googleMapsDirectionsToGym(): string {
  const destCoords = `${SITE.latitude},${SITE.longitude}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${destCoords}&travelmode=driving`;
}

/** @deprecated استعمل googleMapsDirectionsToGym — بلا origin ثابت */
export function googleMapsDirectionsUrl(_userLat: number, _userLon: number): string {
  return googleMapsDirectionsToGym();
}

/** فتح الاتجاهات (أفضل على التيليفون من window.open) */
export function openDirectionsToGym(): void {
  if (typeof window === "undefined") return;
  const url = googleMapsDirectionsToGym();
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = url;
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
