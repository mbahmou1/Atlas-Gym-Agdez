import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatWidgetProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
}

export function StatWidget({ label, value, icon: Icon, iconClassName }: StatWidgetProps) {
  return (
    <div className="gym-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className={cn("h-6 w-6", iconClassName ?? "text-primary")} strokeWidth={1.75} />
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground tabular-nums">
        {value}
      </p>
    </div>
  );
}
