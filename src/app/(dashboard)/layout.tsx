"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarContext } from "@/hooks/use-sidebar";
import { useLanguage } from "@/components/language-provider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dir } = useLanguage();

  return (
    <SidebarContext.Provider value={{ openSidebar: () => setSidebarOpen(true) }}>
      <div className="flex min-h-screen" dir={dir}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex flex-1 flex-col min-h-screen min-w-0 overflow-auto bg-background">{children}</main>
      </div>
    </SidebarContext.Provider>
  );
}
