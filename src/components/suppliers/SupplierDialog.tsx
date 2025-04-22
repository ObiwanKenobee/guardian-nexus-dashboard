
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Supplier, SupplierCategory, SupplierComplianceStatus, SupplierTrustLevel } from "@/types/supplier";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function SupplierDialog({ 
  open, 
  onOpenChange, 
  supplier, 
  onSubmit, 
  isSubmitting 
}: SupplierDialogProps) {
  const isEditing = !!supplier;

  // Form state
  const [formData, setFormData] = useState<Partial<Supplier>>(
    supplier || {
      name: "",
      country: "",
      category: "Other",
      riskScore: 30,
      complianceStatus: "pending",
      trustLevel: "verified"
    }
  );

  // Reset form when dialog opens/closes or supplier changes
  useState(() => {
    if (open && supplier) {
      setFormData(supplier);
    } else if (open && !supplier) {
      setFormData({
        name: "",
        country: "",
        category: "Other",
        riskScore: 30,
        complianceStatus: "pending",
        trustLevel: "verified"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Categories for select
  const categories: SupplierCategory[] = [
    "Hardware", "Software", "Logistics", "Manufacturing", 
    "Electronics", "Materials", "Shipping", "Other"
  ];

  // Compliance statuses
  const complianceStatuses: SupplierComplianceStatus[] = [
    "verified", "pending", "breached"
  ];

  // Trust levels
  const trustLevels: SupplierTrustLevel[] = [
    "verified", "gold", "platinum"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the supplier information below.' 
              : 'Enter the details for the new supplier.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Supplier Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category || 'Other'} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trustLevel">Trust Level</Label>
              <Select 
                value={formData.trustLevel || 'verified'} 
                onValueChange={(value) => handleSelectChange('trustLevel', value as SupplierTrustLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trust level" />
                </SelectTrigger>
                <SelectContent>
                  {trustLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="complianceStatus">Compliance Status</Label>
            <Select 
              value={formData.complianceStatus || 'pending'} 
              onValueChange={(value) => handleSelectChange('complianceStatus', value as SupplierComplianceStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select compliance status" />
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
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="riskScore">Risk Score: {formData.riskScore}%</Label>
            </div>
            <Slider
              id="riskScore"
              min={0}
              max={100}
              step={1}
              value={[formData.riskScore || 30]}
              onValueChange={(value) => setFormData({ ...formData, riskScore: value[0] })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              name="website"
              value={formData.website || ''}
              onChange={handleInputChange}
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
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Supplier' : 'Add Supplier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
