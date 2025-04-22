
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RiskAlert, RiskLevel } from "@/types/riskAlert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Supplier } from "@/types/supplier";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RiskAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: RiskAlert | null;
  suppliers: Supplier[];
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function RiskAlertDialog({
  open,
  onOpenChange,
  alert,
  suppliers,
  onSubmit,
  isSubmitting
}: RiskAlertDialogProps) {
  const isEditing = !!alert;

  // Form state
  const [formData, setFormData] = useState<Partial<RiskAlert>>({
    title: "",
    description: "",
    level: "medium",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " ago",
    acknowledged: false
  });

  // Reset form when dialog opens/closes or alert changes
  useEffect(() => {
    if (open && alert) {
      setFormData(alert);
    } else if (open && !alert) {
      setFormData({
        title: "",
        description: "",
        level: "medium",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " ago",
        source: "",
        affectedSupplierId: "",
        acknowledged: false
      });
    }
  }, [open, alert]);

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

  // Risk levels
  const riskLevels: RiskLevel[] = ["high", "medium", "low", "safe"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Risk Alert' : 'Create New Risk Alert'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the risk alert information below.'
              : 'Enter the details for the new risk alert.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Alert Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              required
              placeholder="Security breach detected"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              required
              placeholder="Detailed description of the risk alert..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Risk Level</Label>
              <Select
                value={formData.level || 'medium'}
                onValueChange={(value) => handleSelectChange('level', value as RiskLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  {riskLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                value={formData.time || ''}
                onChange={handleInputChange}
                required
                placeholder="5 min ago"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source (Optional)</Label>
              <Input
                id="source"
                name="source"
                value={formData.source || ''}
                onChange={handleInputChange}
                placeholder="System monitor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="affectedSupplierId">Affected Supplier (Optional)</Label>
              <Select
                value={formData.affectedSupplierId || ''}
                onValueChange={(value) => handleSelectChange('affectedSupplierId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Alert' : 'Create Alert'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
