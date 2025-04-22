
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Stakeholders() {
  return (
    <DashboardLayout>
      <div className="container p-6 space-y-6">
        <h1 className="text-2xl font-bold">Stakeholder Console</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">ESG Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Environmental</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Social</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Governance</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Transparency Metrics</h2>
            {/* Add QR code generators and public badges here */}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
