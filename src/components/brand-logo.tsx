import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<BrandLogoSize, number> = {
  xs: 48, // h-12
  sm: 72, // h-18
  md: 96, // h-24
  lg: 144, // h-36
  xl: 180, // h-45
};

export function BrandLogo({
  size = "md",
  className,
}: {
  size?: BrandLogoSize;
  className?: string;
}) {
  const dimension = sizeClasses[size];
  
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 shadow-lg",
        className
      )}
      style={{ width: dimension, height: dimension }}
    >
      <Image
        src="/logo-louiyne.png"
        alt="LOUIYNE GYM"
        fill
        className="object-cover"
        sizes={`${dimension}px`}
        priority
      />
    </div>
  );
}
