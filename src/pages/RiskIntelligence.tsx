
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskAlertCard } from "@/components/dashboard/RiskAlertCard";
import { Card } from "@/components/ui/card";

export default function RiskIntelligence() {
  const alerts = [
    {
      title: "High-Risk Supplier Alert",
      description: "Major supplier in Asia showing financial distress signals",
      level: "high",
      time: "2 hours ago"
    },
    {
      title: "Compliance Update Required",
      description: "ESG documentation update needed for 3 suppliers",
      level: "medium",
      time: "5 hours ago"
    }
  ] as const;

  return (
    <DashboardLayout>
      <div className="container p-6 space-y-6">
        <h1 className="text-2xl font-bold">Risk Intelligence</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Real-time Alerts</h2>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <RiskAlertCard key={alert.title} {...alert} />
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Risk Scorecards</h2>
            <div className="space-y-4">
              {/* Add AI-driven supplier risk scorecards here */}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
