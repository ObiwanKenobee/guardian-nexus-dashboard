
import React from "react";
import { useTheme } from "next-themes";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme, setTheme } = useTheme();

  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar theme={theme || 'light'} setTheme={handleSetTheme} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
