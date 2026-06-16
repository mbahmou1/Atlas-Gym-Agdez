import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<BrandLogoSize, number> = {
  xs: 48,
  sm: 72,
  md: 96,
  lg: 144,
  xl: 180,
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
      className={cn("relative shrink-0 bg-transparent", className)}
      style={{ width: dimension, height: dimension }}
    >
      <Image
        src="/logo-louiyne.png"
        alt="LOUIYNE GYM"
        fill
        className="object-contain"
        sizes={`${dimension}px`}
        priority
      />
    </div>
  );
}
