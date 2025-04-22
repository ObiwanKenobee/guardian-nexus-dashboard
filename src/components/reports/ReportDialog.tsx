
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ReportType, ReportFormat } from "@/types/report";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, FileSpreadsheet, FileOutput } from "lucide-react";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultReportType?: ReportType;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function ReportDialog({
  open,
  onOpenChange,
  defaultReportType = "ISO Compliance",
  onSubmit,
  isSubmitting
}: ReportDialogProps) {
  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    type: ReportType;
    format: ReportFormat;
    parameters?: Record<string, any>;
    notes?: string;
    dateRange: "last30days" | "last90days" | "lastyear" | "custom";
    includeCharts: boolean;
  }>({
    name: "",
    type: defaultReportType,
    format: "PDF",
    dateRange: "last30days",
    includeCharts: true
  });

  // Reset form when dialog opens/closes or default type changes
  useEffect(() => {
    if (open) {
      const reportName = `${defaultReportType} Report - ${new Date().toLocaleDateString()}`;
      
      setFormData({
        name: reportName,
        type: defaultReportType,
        format: "PDF",
        dateRange: "last30days",
        includeCharts: true
      });
    }
  }, [open, defaultReportType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare parameters based on form selections
    const parameters = {
      dateRange: formData.dateRange,
      includeCharts: formData.includeCharts
    };
    
    onSubmit({
      ...formData,
      parameters
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Report types
  const reportTypes: ReportType[] = [
    "ISO Compliance",
    "ESG Report",
    "GDPR Compliance",
    "Risk Assessment",
    "Supplier Evaluation",
    "Supply Chain Analysis"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Configure your report generation settings below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Report Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Report Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value as ReportType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Report Format</Label>
            <RadioGroup 
              defaultValue="PDF" 
              className="flex space-x-4"
              value={formData.format}
              onValueChange={(value) => handleSelectChange('format', value as ReportFormat)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PDF" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CSV" id="csv" />
                <Label htmlFor="csv" className="flex items-center">
                  <FileOutput className="h-4 w-4 mr-2" />
                  CSV
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Time Period</Label>
            <RadioGroup 
              defaultValue="last30days" 
              className="grid grid-cols-2 gap-4"
              value={formData.dateRange}
              onValueChange={(value) => handleSelectChange('dateRange', value as any)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="last30days" id="last30days" />
                <Label htmlFor="last30days">Last 30 Days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="last90days" id="last90days" />
                <Label htmlFor="last90days">Last 90 Days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lastyear" id="lastyear" />
                <Label htmlFor="lastyear">Last Year</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeCharts"
                checked={formData.includeCharts}
                onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="includeCharts">Include charts and visualizations</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              placeholder="Additional notes or instructions..."
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
              {isSubmitting ? 'Generating...' : 'Generate Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
