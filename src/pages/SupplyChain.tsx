
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SupplyChainMap } from "@/components/dashboard/SupplyChainMap";

const mockData = {
  nodes: [
    { id: "hq", name: "HQ", category: "HQ", country: "USA", riskScore: 10, group: 1 },
    { id: "sup1", name: "Supplier 1", category: "Tier 1", country: "China", riskScore: 75, group: 2 },
    { id: "sup2", name: "Supplier 2", category: "Tier 1", country: "Germany", riskScore: 25, group: 2 }
  ],
  links: [
    { source: "hq", target: "sup1", value: 1 },
    { source: "hq", target: "sup2", value: 1 }
  ]
};

export default function SupplyChain() {
  return (
    <DashboardLayout>
      <div className="container p-6 space-y-6">
        <h1 className="text-2xl font-bold">Supply Chain Network</h1>
        <SupplyChainMap nodes={mockData.nodes} links={mockData.links} />
      </div>
    </DashboardLayout>
  );
}
