
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Plus, Download, Calendar, FileText, Search } from "lucide-react";
import { reportService } from "@/services/reportService";
import { ReportType, ReportFormat, Report } from "@/types/report";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportDialog } from "@/components/reports/ReportDialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function Reporting() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>("ISO Compliance");
  const [searchTerm, setSearchTerm] = useState("");
  
  const queryClient = useQueryClient();

  // Fetch reports
  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: reportService.getAll.bind(reportService),
  });

  // Generate report mutation
  const generateMutation = useMutation({
    mutationFn: ({ 
      name, 
      type, 
      format, 
      parameters, 
      notes 
    }: { 
      name: string, 
      type: ReportType, 
      format: ReportFormat,
      parameters?: Record<string, any>,
      notes?: string
    }) => 
      reportService.generateReport(name, type, format, parameters, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setIsDialogOpen(false);
      toast.success("Report generated successfully");
    },
    onError: () => {
      toast.error("Failed to generate report");
    }
  });

  // Delete report mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success("Report deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete report");
    }
  });

  const handleGenerateReport = (data: any) => {
    generateMutation.mutate({
      name: data.name,
      type: data.type,
      format: data.format,
      parameters: data.parameters,
      notes: data.notes
    });
  };

  const handleDeleteReport = (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDownloadReport = (report: any) => {
    if (report.downloadUrl) {
      window.open(report.downloadUrl, '_blank');
      toast.success("Report download started");
    } else {
      toast.error("Download URL not available");
    }
  };

  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reportTemplates = [
    {
      title: "ISO Compliance",
      type: "ISO Compliance" as ReportType,
      description: "Comprehensive ISO standard compliance report"
    },
    {
      title: "ESG Report",
      type: "ESG Report" as ReportType,
      description: "Environmental, Social, and Governance metrics"
    },
    {
      title: "GDPR Compliance",
      type: "GDPR Compliance" as ReportType,
      description: "Data protection and privacy compliance"
    },
    {
      title: "Risk Assessment",
      type: "Risk Assessment" as ReportType,
      description: "Supply chain risk evaluation"
    },
    {
      title: "Supplier Evaluation",
      type: "Supplier Evaluation" as ReportType,
      description: "Detailed supplier performance analysis"
    },
    {
      title: "Supply Chain Analysis",
      type: "Supply Chain Analysis" as ReportType,
      description: "End-to-end supply chain visibility report"
    },
  ];

  const getFormatIcon = (format: ReportFormat) => {
    switch (format) {
      case "PDF":
        return <FileText className="h-4 w-4" />;
      case "Excel":
        return <FileText className="h-4 w-4" />;
      case "CSV":
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Reporting Center</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>

        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
          </TabsList>
          <TabsContent value="templates">
            <div className="grid gap-6 md:grid-cols-3">
              {reportTemplates.map((template, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        setSelectedReportType(template.type);
                        setIsDialogOpen(true);
                      }}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-semibold">Generated Reports</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-9 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Generated Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">Loading reports...</TableCell>
                      </TableRow>
                    ) : filteredReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">No reports found</TableCell>
                      </TableRow>
                    ) : (
                      filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center w-fit">
                              {getFormatIcon(report.format)}
                              <span className="ml-1">{report.format}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(report.generatedDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadReport(report)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-risk-high hover:text-risk-high"
                              onClick={() => handleDeleteReport(report.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Report Generation Dialog */}
      <ReportDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        defaultReportType={selectedReportType}
        onSubmit={handleGenerateReport}
        isSubmitting={generateMutation.isPending}
      />
    </DashboardLayout>
  );
}
