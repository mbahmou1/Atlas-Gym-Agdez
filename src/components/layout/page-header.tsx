"use client";

import { Header } from "@/components/layout/header";
import { useSidebar } from "@/hooks/use-sidebar";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const { openSidebar } = useSidebar();
  return (
    <Header
      title={title}
      subtitle={subtitle}
      onMenuClick={openSidebar}
      actions={actions}
    />
  );
}
