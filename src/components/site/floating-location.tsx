"use client";

import { useCallback, useState } from "react";
import { Loader2, Navigation } from "lucide-react";
import { SITE } from "@/lib/site-config";
import { distanceToGymKm, formatDistanceKm, googleMapsDirectionsUrl } from "@/lib/geo";
import { cn } from "@/lib/utils";

type GeoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; lat: number; lon: number; distanceKm: number }
  | { status: "denied" }
  | { status: "error" };

export function FloatingLocation() {
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });

  const handleClick = useCallback(() => {
    if (geo.status === "loading") return;

    // إلا عندنا موقع جاهز — فتح الاتجاهات مباشرة
    if (geo.status === "ready") {
      window.open(googleMapsDirectionsUrl(geo.lat, geo.lon), "_blank", "noopener,noreferrer");
      return;
    }

    // إذا ما عندناش موقع — نطلبو أولاً
    if (!navigator.geolocation) {
      window.open(SITE.mapsUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setGeo({ status: "loading" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const km = distanceToGymKm(lat, lon);
        setGeo({ status: "ready", lat, lon, distanceKm: km });
        // نفتح الاتجاهات مباشرة بعد ما نلقاو الموقع
        window.open(googleMapsDirectionsUrl(lat, lon), "_blank", "noopener,noreferrer");
      },
      () => {
        setGeo({ status: "denied" });
        // الموقع مرفوض — نفتح موقع القاعة فقط
        window.open(SITE.mapsUrl, "_blank", "noopener,noreferrer");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }, [geo]);

  const isLoading = geo.status === "loading";
  const hasDistance = geo.status === "ready";

  return (
    <div className="fixed bottom-6 start-6 z-40">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        aria-label="الاتجاهات إلى القاعة"
        className={cn(
          "group flex min-h-14 items-center gap-2.5 rounded-full px-4 py-3",
          "bg-primary text-primary-foreground shadow-xl shadow-primary/30",
          "transition-all hover:scale-[1.03] hover:brightness-110 active:scale-95",
          isLoading && "cursor-wait opacity-80"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
        ) : (
          <Navigation className="h-5 w-5 shrink-0 transition-transform group-hover:-rotate-12" />
        )}
        <span className="flex flex-col items-start leading-tight text-start">
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
            {hasDistance ? "على بعد" : "الاتجاهات"}
          </span>
          <span className="text-sm font-black">
            {isLoading
              ? "جاري تحديد موقعك…"
              : hasDistance
                ? formatDistanceKm(geo.distanceKm)
                : "للقاعة الآن"}
          </span>
        </span>
      </button>
    </div>
  );
}
