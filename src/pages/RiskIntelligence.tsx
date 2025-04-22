
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskAlertCard } from "@/components/dashboard/RiskAlertCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { riskAlertService } from "@/services/riskAlertService";
import { RiskAlert } from "@/types/riskAlert";
import { RiskAlertDialog } from "@/components/risk/RiskAlertDialog";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supplierService } from "@/services/supplierService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskScorecard } from "@/components/risk/RiskScorecard";
import { Supplier } from "@/types/supplier";

export default function RiskIntelligence() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<RiskAlert | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>("");
  
  const queryClient = useQueryClient();

  // Fetch risk alerts
  const { data: alerts = [], isLoading } = useQuery<RiskAlert[]>({
    queryKey: ['riskAlerts'],
    queryFn: riskAlertService.getAll.bind(riskAlertService),
  });

  // Fetch suppliers for reference
  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: supplierService.getAll.bind(supplierService),
  });

  // Create alert mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<RiskAlert, 'id' | 'createdAt' | 'updatedAt'>) => 
      riskAlertService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskAlerts'] });
      setIsDialogOpen(false);
      toast.success("Risk alert created successfully");
    },
    onError: () => {
      toast.error("Failed to create risk alert");
    }
  });

  // Update alert mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<RiskAlert> }) => 
      riskAlertService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskAlerts'] });
      setIsDialogOpen(false);
      setEditingAlert(null);
      toast.success("Risk alert updated successfully");
    },
    onError: () => {
      toast.error("Failed to update risk alert");
    }
  });

  // Delete alert mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => riskAlertService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskAlerts'] });
      toast.success("Risk alert deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete risk alert");
    }
  });

  // Acknowledge alert mutation
  const acknowledgeMutation = useMutation({
    mutationFn: (id: string) => riskAlertService.acknowledgeAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskAlerts'] });
      toast.success("Alert acknowledged");
    },
  });

  const handleCreateAlert = (data: Omit<RiskAlert, 'id' | 'createdAt' | 'updatedAt'>) => {
    createMutation.mutate(data);
  };

  const handleUpdateAlert = (data: Partial<RiskAlert>) => {
    if (editingAlert) {
      updateMutation.mutate({ id: editingAlert.id, data });
    }
  };

  const handleEditAlert = (alert: RiskAlert) => {
    setEditingAlert(alert);
    setIsDialogOpen(true);
  };

  const handleDeleteAlert = (id: string) => {
    if (confirm("Are you sure you want to delete this alert?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAcknowledgeAlert = (id: string) => {
    acknowledgeMutation.mutate(id);
  };

  // Filter alerts based on level
  const filteredAlerts = filterLevel 
    ? alerts.filter(alert => alert.level === filterLevel)
    : alerts;

  // Group alerts by level for scorecards
  const alertsByLevel = {
    high: alerts.filter(alert => alert.level === 'high').length,
    medium: alerts.filter(alert => alert.level === 'medium').length,
    low: alerts.filter(alert => alert.level === 'low').length,
    safe: alerts.filter(alert => alert.level === 'safe').length
  };

  // Get high risk suppliers
  const highRiskSuppliers = suppliers
    .filter(supplier => supplier.riskScore >= 70)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  return (
    <DashboardLayout>
      <div className="container p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Risk Intelligence</h1>
          <Button onClick={() => {
            setEditingAlert(null);
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            New Alert
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-risk-high/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertsByLevel.high}</div>
              <p className="text-xs text-muted-foreground">
                {alertsByLevel.high > 0 
                  ? 'Immediate action required' 
                  : 'No high risk alerts'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-risk-medium/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Medium Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertsByLevel.medium}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention soon
              </p>
            </CardContent>
          </Card>

          <Card className="bg-risk-low/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertsByLevel.low}</div>
              <p className="text-xs text-muted-foreground">
                Monitor as needed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-risk-safe/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Safe/Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertsByLevel.safe}</div>
              <p className="text-xs text-muted-foreground">
                No action required
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="alerts">Real-time Alerts</TabsTrigger>
            <TabsTrigger value="scorecards">Risk Scorecards</TabsTrigger>
          </TabsList>
          <TabsContent value="alerts">
            <Card>
              <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-semibold">Real-time Alerts</h2>
                <div className="w-full sm:w-48">
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-levels">All Levels</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="safe">Safe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="px-6 pb-6 space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 animate-pulse bg-muted rounded-md"></div>
                    ))}
                  </div>
                ) : filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <RiskAlertCard 
                      key={alert.id} 
                      {...alert} 
                      onEdit={() => handleEditAlert(alert)}
                      onDelete={() => handleDeleteAlert(alert.id)}
                      onAction={() => handleAcknowledgeAlert(alert.id)}
                      actionText={alert.acknowledged ? "Acknowledged" : "Acknowledge"}
                    />
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No alerts found</p>
                    {filterLevel && (
                      <Button 
                        variant="link" 
                        onClick={() => setFilterLevel("")}
                        className="mt-2"
                      >
                        Clear filter
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="scorecards">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">AI-driven Risk Scorecards</h2>
                <div className="space-y-6">
                  {highRiskSuppliers.length > 0 ? (
                    highRiskSuppliers.map(supplier => (
                      <RiskScorecard key={supplier.id} supplier={supplier} />
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No high risk suppliers found</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Risk Alert Dialog for Create/Edit */}
      <RiskAlertDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        alert={editingAlert}
        suppliers={suppliers}
        onSubmit={editingAlert ? handleUpdateAlert : handleCreateAlert}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </DashboardLayout>
  );
}
