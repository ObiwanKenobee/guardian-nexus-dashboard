
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ComplianceRecord, ComplianceStatus, ComplianceType } from "@/types/compliance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Supplier } from "@/types/supplier";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComplianceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: ComplianceRecord | null;
  suppliers: Supplier[];
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function ComplianceDialog({ 
  open, 
  onOpenChange, 
  record, 
  suppliers,
  onSubmit, 
  isSubmitting 
}: ComplianceDialogProps) {
  const isEditing = !!record;

  // Form state
  const [formData, setFormData] = useState<Partial<ComplianceRecord>>({
    supplierId: "",
    supplierName: "",
    type: "ISO 27001",
    status: "pending",
    issueDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 31536000000).toISOString(), // + 1 year
    notes: ""
  });

  // Reset form when dialog opens/closes or record changes
  useEffect(() => {
    if (open && record) {
      setFormData(record);
    } else if (open && !record) {
      setFormData({
        supplierId: suppliers[0]?.id || "",
        supplierName: suppliers[0]?.name || "",
        type: "ISO 27001",
        status: "pending",
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 31536000000).toISOString(),
        notes: ""
      });
    }
  }, [open, record, suppliers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSupplierChange = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      setFormData({
        ...formData,
        supplierId: supplier.id,
        supplierName: supplier.name
      });
    }
  };

  // Compliance types
  const complianceTypes: ComplianceType[] = [
    "ISO 27001", "GDPR", "ESG", "SOC 2", "HIPAA", "PCI DSS", "Other"
  ];

  // Compliance statuses
  const complianceStatuses: ComplianceStatus[] = [
    "valid", "pending", "expired", "revoked"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Compliance Record' : 'Add New Compliance Record'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the compliance record information below.' 
              : 'Enter the details for the new compliance record.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="supplierId">Supplier</Label>
            <Select 
              value={formData.supplierId}
              onValueChange={handleSupplierChange}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Compliance Type</Label>
              <Select 
                value={formData.type || 'ISO 27001'} 
                onValueChange={(value) => handleSelectChange('type', value as ComplianceType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select compliance type" />
                </SelectTrigger>
                <SelectContent>
                  {complianceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status || 'pending'} 
                onValueChange={(value) => handleSelectChange('status', value as ComplianceStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {complianceStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.issueDate ? (
                      format(new Date(formData.issueDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(formData.issueDate || Date.now())}
                    onSelect={(date) => date && setFormData({
                      ...formData,
                      issueDate: date.toISOString()
                    })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? (
                      format(new Date(formData.expiryDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(formData.expiryDate || Date.now())}
                    onSelect={(date) => date && setFormData({
                      ...formData,
                      expiryDate: date.toISOString()
                    })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="documentUrl">Document URL (Optional)</Label>
            <Input
              id="documentUrl"
              name="documentUrl"
              value={formData.documentUrl || ''}
              onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Record' : 'Add Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
