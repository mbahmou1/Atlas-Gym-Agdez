import { MapPin, Navigation } from "lucide-react";
import { GymDirectionsButton } from "@/components/site/gym-directions-button";
import { SITE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function LocationBlock({
  variant = "hero",
  showMapButton = true,
  className,
}: {
  variant?: "hero" | "card";
  showMapButton?: boolean;
  className?: string;
}) {
  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "flex flex-col",
        isHero
          ? "mx-auto max-w-md items-center text-center rounded-2xl border border-primary/25 bg-[#17120d]/70 px-6 py-5 shadow-2xl shadow-primary/10 backdrop-blur-md"
          : "items-start text-start rounded-xl border border-border bg-card/80 px-5 py-4",
        className
      )}
    >
      <h2
        className={cn(
          "font-display font-bold leading-tight",
          isHero ? "text-2xl text-white md:text-3xl" : "text-xl text-foreground"
        )}
      >
        {SITE.gymTitleAr}
      </h2>
      <p
        className={cn(
          "mt-1 font-black uppercase tracking-widest text-primary",
          isHero ? "text-xl md:text-2xl" : "text-lg md:text-xl"
        )}
      >
        {SITE.brandLine}
      </p>
      <p
        className={cn(
          "mt-3 flex items-center justify-center gap-2 leading-relaxed",
          isHero ? "text-sm text-white/90" : "text-sm text-muted-foreground",
          !isHero && "justify-start text-start"
        )}
      >
        <MapPin className="h-4 w-4 shrink-0 text-primary/90" />
        {SITE.address}
      </p>
      {showMapButton && (
        <GymDirectionsButton
          className={cn(
            "mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-transform active:scale-[0.98]",
            isHero
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:brightness-110"
              : "bg-primary text-primary-foreground w-full sm:w-auto hover:brightness-110"
          )}
        >
          <Navigation className="h-4 w-4" />
          الاتجاهات من موقعي
        </GymDirectionsButton>
      )}
    </div>
  );
}
