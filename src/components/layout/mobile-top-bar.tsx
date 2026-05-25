"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { BrandLogo } from "@/components/brand-logo";

export function MobileTopBar() {
  const { openSidebar } = useSidebar();

  return (
    <div className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
      <Button variant="ghost" size="icon" className="shrink-0" onClick={openSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      <BrandLogo size="sm" />
      <div className="w-10" aria-hidden />
    </div>
  );
}
