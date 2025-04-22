
import { useState, useEffect } from "react";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || 
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar theme={theme} setTheme={handleSetTheme} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
