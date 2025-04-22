
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SupplierCard } from "@/components/dashboard/SupplierCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Suppliers() {
  const suppliers = [
    {
      name: "Tech Solutions Inc",
      country: "United States",
      category: "Electronics",
      riskScore: 25,
      complianceStatus: "verified",
      trustLevel: "platinum"
    },
    {
      name: "Global Manufacturing Co",
      country: "Germany",
      category: "Manufacturing",
      riskScore: 45,
      complianceStatus: "pending",
      trustLevel: "gold"
    }
  ] as const;

  return (
    <DashboardLayout>
      <div className="container p-6 space-y-6">
        <h1 className="text-2xl font-bold">Supplier Marketplace</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            className="pl-9"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.name} {...supplier} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
