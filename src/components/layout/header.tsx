"use client";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ title, subtitle, onMenuClick, actions }: { title: string; subtitle?: string; onMenuClick?: () => void; actions?: React.ReactNode }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}><Menu className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
