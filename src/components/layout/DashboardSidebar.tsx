
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Shield, 
  FileText, 
  Map, 
  BarChart, 
  User, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Moon,
  Cog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const mainNavItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Risk Intelligence", href: "/risk", icon: Shield },
  { name: "Compliance Ledger", href: "/compliance", icon: FileText },
  { name: "Supply Chain", href: "/supply-chain", icon: Map },
  { name: "Reporting", href: "/reports", icon: BarChart },
  { name: "Stakeholders", href: "/stakeholders", icon: User },
  { name: "Suppliers", href: "/suppliers", icon: List },
];

interface SidebarProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export function DashboardSidebar({ theme, setTheme }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-sidebar-foreground font-bold text-lg">
            Guardian<span className="text-guardian-purple">IO</span>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <span className="text-guardian-purple font-bold text-xl">G</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {mainNavItems.map((item) => (
            <Tooltip key={item.name} delayDuration={300}>
              <TooltipTrigger asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-2 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent group",
                    window.location.pathname === item.href
                      ? "bg-sidebar-accent text-guardian-purple"
                      : ""
                  )}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0 w-6 h-6",
                      window.location.pathname === item.href
                        ? "text-guardian-purple"
                        : "text-sidebar-foreground"
                    )}
                  />
                  {!collapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">{item.name}</TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <Cog size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
