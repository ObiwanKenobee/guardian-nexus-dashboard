
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export default function Reporting() {
  return (
    <DashboardLayout>
      <div className="container p-6 space-y-6">
        <h1 className="text-2xl font-bold">Reporting Center</h1>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">ISO Compliance</h2>
            <Button className="w-full" variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">ESG Report</h2>
            <Button className="w-full" variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">GDPR Compliance</h2>
            <Button className="w-full" variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
