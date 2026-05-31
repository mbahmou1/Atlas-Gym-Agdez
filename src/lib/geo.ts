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
 * اتجاهات: origin = GPS المستخدم (إحداثيات حية)
 * destination = موقع القاعة الثابت (رابط Google Maps)
 */
export function googleMapsDirectionsFromUser(userLat: number, userLon: number): string {
  const origin = `${userLat},${userLon}`;
  const destination = encodeURIComponent(SITE.mapsUrl);
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
}

function openUrl(url: string): void {
  if (typeof window === "undefined") return;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = url;
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/** فتح الاتجاهات من إحداثيات GPS محددة */
export function openDirectionsFromUser(userLat: number, userLon: number): void {
  openUrl(googleMapsDirectionsFromUser(userLat, userLon));
}

/** يطلب navigator.geolocation ثم يفتح Maps: origin=GPS ديالك، destination=القاعة */
export function navigateToGymFromCurrentLocation(
  onPosition?: (lat: number, lon: number, distanceKm: number) => void
): Promise<"ok" | "denied" | "unsupported"> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      openUrl(SITE.mapsUrl);
      resolve("unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        onPosition?.(lat, lon, distanceToGymKm(lat, lon));
        openDirectionsFromUser(lat, lon);
        resolve("ok");
      },
      () => {
        openUrl(SITE.mapsUrl);
        resolve("denied");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}
