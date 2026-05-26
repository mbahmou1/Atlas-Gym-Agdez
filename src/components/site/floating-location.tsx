"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Navigation } from "lucide-react";
import {
  distanceToGymKm,
  formatDistanceKm,
  openDirectionsToGym,
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
        setGeo({
          status: "ready",
          lat,
          lon,
          distanceKm: distanceToGymKm(lat, lon),
        });
      },
      () => setGeo({ status: "denied" }),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    refreshPosition();
  }, [refreshPosition]);

  const handleClick = () => {
    // فتح Maps من موقعك الحالي (Google يحدد GPS داخل التطبيق)
    openDirectionsToGym();
    // تحديث المسافة إن لم تكن جاهزة
    if (geo.status !== "ready" && geo.status !== "loading") {
      refreshPosition();
    }
  };

  const isLoading = geo.status === "loading";
  const hasDistance = geo.status === "ready";

  return (
    <div className="fixed bottom-6 start-6 z-40">
      <button
        type="button"
        onClick={handleClick}
        aria-label="الاتجاهات من موقعك إلى القاعة"
        className={cn(
          "group flex min-h-14 items-center gap-2.5 rounded-full px-4 py-3",
          "bg-primary text-primary-foreground shadow-xl shadow-primary/30",
          "transition-all hover:scale-[1.03] hover:brightness-110 active:scale-95"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 shrink-0 animate-spin opacity-80" />
        ) : (
          <Navigation className="h-5 w-5 shrink-0 transition-transform group-hover:-rotate-12" />
        )}
        <span className="flex flex-col items-start leading-tight text-start">
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
            {hasDistance ? "على بعد" : "من موقعك"}
          </span>
          <span className="text-sm font-black">
            {hasDistance
              ? `${formatDistanceKm(geo.distanceKm)} → القاعة`
              : "الاتجاهات للقاعة"}
          </span>
        </span>
      </button>
    </div>
  );
}
