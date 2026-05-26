"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { SITE } from "@/lib/site-config";
import {
  distanceToGymKm,
  formatDistanceKm,
  googleMapsDirectionsUrl,
} from "@/lib/geo";
import { cn } from "@/lib/utils";

type GeoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; lat: number; lon: number; distanceKm: number }
  | { status: "denied" }
  | { status: "error" };

export function FloatingLocation() {
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });

  const refreshPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo({ status: "error" });
      return;
    }
    setGeo({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const distanceKm = distanceToGymKm(lat, lon);
        setGeo({ status: "ready", lat, lon, distanceKm });
      },
      () => setGeo({ status: "denied" }),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    refreshPosition();
  }, [refreshPosition]);

  const mapsHref =
    geo.status === "ready"
      ? googleMapsDirectionsUrl(geo.lat, geo.lon)
      : SITE.mapsUrl;

  const distanceLabel =
    geo.status === "ready"
      ? formatDistanceKm(geo.distanceKm)
      : geo.status === "loading"
        ? "…"
        : null;

  return (
    <div className="fixed bottom-6 start-6 z-40 flex flex-col items-start gap-2">
      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          if (geo.status !== "ready" && geo.status !== "loading") refreshPosition();
        }}
        className={cn(
          "group flex min-h-14 items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] active:scale-[0.98]",
          geo.status === "loading" && "pointer-events-none opacity-90"
        )}
        aria-label="الموقع والمسافة إلى القاعة"
      >
        {geo.status === "loading" ? (
          <Loader2 className="h-6 w-6 shrink-0 animate-spin" />
        ) : (
          <Navigation className="h-6 w-6 shrink-0" />
        )}
        <span className="flex flex-col items-start leading-tight text-start">
          <span className="text-xs font-bold opacity-90">القاعة</span>
          <span className="text-sm font-black">
            {distanceLabel ? `على بعد ${distanceLabel}` : "الموقع على الخريطة"}
          </span>
        </span>
        <MapPin className="h-5 w-5 shrink-0 opacity-80 group-hover:opacity-100" />
      </a>

      {(geo.status === "denied" || geo.status === "error") && (
        <button
          type="button"
          onClick={refreshPosition}
          className="rounded-lg border border-border bg-card/95 px-3 py-1.5 text-[11px] font-bold text-muted-foreground shadow-md backdrop-blur hover:text-foreground"
        >
          تفعيل الموقع لحساب المسافة
        </button>
      )}
    </div>
  );
}
