
import { BarChart, Shield, Map, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskAlertCard } from "@/components/dashboard/RiskAlertCard";
import { SupplierCard } from "@/components/dashboard/SupplierCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { SupplyChainMap } from "@/components/dashboard/SupplyChainMap";
import { riskAlerts, supplierData, supplierNodes, supplierLinks, dashboardStats } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Jan", riskScore: 35, compliance: 65 },
  { name: "Feb", riskScore: 45, compliance: 68 },
  { name: "Mar", riskScore: 55, compliance: 72 },
  { name: "Apr", riskScore: 58, compliance: 75 },
  { name: "May", riskScore: 68, compliance: 78 },
  { name: "Jun", riskScore: 62, compliance: 82 },
  { name: "Jul", riskScore: 55, compliance: 85 },
  { name: "Aug", riskScore: 48, compliance: 89 },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Guardian-IO Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your overview for today.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Export Report
            </Button>
            <Button size="sm">New Scan</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Intelligence */}
          <div className="lg:col-span-2 space-y-6">
            {/* Risk Intelligence Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-guardian-purple" />
                <h2 className="text-lg font-medium">Risk Intelligence</h2>
              </div>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </div>

            {/* Risk Alerts */}
            <div className="space-y-4">
              {riskAlerts.map((alert) => (
                <RiskAlertCard
                  key={alert.id}
                  title={alert.title}
                  description={alert.description}
                  level={alert.level as any}
                  time={alert.time}
                />
              ))}
            </div>

            {/* Compliance Trend */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-guardian-purple" />
                  <CardTitle>Risk & Compliance Trends</CardTitle>
                </div>
                <CardDescription>
                  Monthly overview of risk scores and compliance rates
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="riskScore"
                        fill="#ea384c"
                        name="Risk Score"
                      />
                      <Bar
                        dataKey="compliance"
                        fill="#0EA5E9"
                        name="Compliance"
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suppliers */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Map className="h-5 w-5 mr-2 text-guardian-purple" />
                <h2 className="text-lg font-medium">Suppliers</h2>
              </div>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </div>

            <div className="space-y-4">
              {supplierData.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  id={supplier.id}
                  name={supplier.name}
                  country={supplier.country}
                  category={supplier.category}
                  riskScore={supplier.riskScore}
                  complianceStatus={supplier.complianceStatus as any}
                  trustLevel={supplier.trustLevel as any}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Supply Chain Map */}
        <div className="h-[500px]">
          <SupplyChainMap nodes={supplierNodes} links={supplierLinks} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
