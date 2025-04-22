
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, FileDown, CheckCircle, AlertCircle, Clock, Ban } from "lucide-react";
import { complianceService } from "@/services/complianceService";
import { ComplianceDialog } from "@/components/compliance/ComplianceDialog";
import { ComplianceRecord, ComplianceStatus } from "@/types/compliance";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supplierService } from "@/services/supplierService";
import { ComplianceTimeline } from "@/components/compliance/ComplianceTimeline";
import { Supplier } from "@/types/supplier";

export default function ComplianceLedger() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ComplianceRecord | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch compliance records
  const { data: complianceRecords = [], isLoading } = useQuery<ComplianceRecord[]>({
    queryKey: ['complianceRecords'],
    queryFn: complianceService.getAll.bind(complianceService),
  });

  // Fetch suppliers for the dialog
  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: supplierService.getAll.bind(supplierService),
  });

  // Create compliance record mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<ComplianceRecord, 'id' | 'createdAt' | 'updatedAt'>) => 
      complianceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complianceRecords'] });
      setIsDialogOpen(false);
      toast.success("Compliance record created successfully");
    },
    onError: () => {
      toast.error("Failed to create compliance record");
    }
  });

  // Update compliance record mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<ComplianceRecord> }) => 
      complianceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complianceRecords'] });
      setIsDialogOpen(false);
      setEditingRecord(null);
      toast.success("Compliance record updated successfully");
    },
    onError: () => {
      toast.error("Failed to update compliance record");
    }
  });

  // Delete compliance record mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => complianceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complianceRecords'] });
      toast.success("Compliance record deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete compliance record");
    }
  });

  const handleCreateRecord = (data: Omit<ComplianceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    createMutation.mutate(data);
  };

  const handleUpdateRecord = (data: Partial<ComplianceRecord>) => {
    if (editingRecord) {
      updateMutation.mutate({ id: editingRecord.id, data });
    }
  };

  const handleEditRecord = (record: ComplianceRecord) => {
    setEditingRecord(record);
    setIsDialogOpen(true);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this compliance record?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-risk-safe">
          <CheckCircle className="h-3 w-3 mr-1" /> Valid
        </Badge>;
      case "pending":
        return <Badge variant="outline" className="text-risk-medium border-risk-medium">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>;
      case "expired":
        return <Badge variant="outline" className="text-risk-medium border-risk-medium">
          <AlertCircle className="h-3 w-3 mr-1" /> Expired
        </Badge>;
      case "revoked":
        return <Badge className="bg-risk-high">
          <Ban className="h-3 w-3 mr-1" /> Revoked
        </Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="container p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Compliance Ledger</h1>
          <div className="flex space-x-2">
            <Button onClick={() => {
              setEditingRecord(null);
              setIsDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              New Record
            </Button>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Export Records
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Compliance Timeline</h2>
            <ScrollArea className="h-[400px]">
              <ComplianceTimeline records={complianceRecords} />
            </ScrollArea>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Smart Contract Status</h2>
            <div className="flex flex-col items-center justify-center h-[400px]">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Blockchain Verification</h3>
                <p className="text-muted-foreground mb-4">All compliance records are verified and stored on the blockchain for maximum integrity and transparency.</p>
                <Button variant="outline">
                  Verify on Blockchain
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Compliance Records</h2>
          </div>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">Loading compliance records...</TableCell>
                  </TableRow>
                ) : complianceRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">No compliance records found</TableCell>
                  </TableRow>
                ) : (
                  complianceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.supplierName}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{new Date(record.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(record.expiryDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditRecord(record)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-risk-high hover:text-risk-high"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>

      {/* Compliance Dialog for Create/Edit */}
      <ComplianceDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        record={editingRecord}
        suppliers={suppliers}
        onSubmit={editingRecord ? handleUpdateRecord : handleCreateRecord}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </DashboardLayout>
  );
}
