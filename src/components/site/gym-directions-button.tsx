"use client";

import { useState } from "react";
import { Loader2, Navigation } from "lucide-react";
import { navigateToGymFromCurrentLocation } from "@/lib/geo";
import { cn } from "@/lib/utils";

export function GymDirectionsButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await navigateToGymFromCurrentLocation();
        setLoading(false);
      }}
      className={cn(className, loading && "cursor-wait opacity-90")}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          جاري تحديد موقعك…
        </>
      ) : (
        children
      )}
    </button>
  );
}
