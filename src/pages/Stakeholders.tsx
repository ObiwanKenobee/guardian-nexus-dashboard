import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Download, Share2, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function Stakeholders() {
  const [copied, setCopied] = useState(false);
  const [transparencyLevel, setTransparencyLevel] = useState(80);

  // ESG Data
  const [esgData, setEsgData] = useState({
    environmental: 85,
    social: 75,
    governance: 90
  });

  const pieChartData = [
    { name: 'Environmental', value: esgData.environmental, color: '#10B981' },
    { name: 'Social', value: esgData.social, color: '#0EA5E9' },
    { name: 'Governance', value: esgData.governance, color: '#6366F1' },
  ];

  // Certifications and badges
  const certifications = [
    { name: "Carbon Neutral", achieved: true, progress: 100 },
    { name: "ISO 14001", achieved: true, progress: 100 },
    { name: "Fair Trade", achieved: false, progress: 65 },
    { name: "B Corp", achieved: false, progress: 80 }
  ];

  const transparencyBadgeUrl = `https://guardian-io.example/verify/${transparencyLevel}`;
  
  const handleCopyBadgeUrl = () => {
    navigator.clipboard.writeText(transparencyBadgeUrl).then(() => {
      setCopied(true);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleEsgChange = (category: keyof typeof esgData, value: number) => {
    setEsgData(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const generateQRCode = () => {
    toast.success("QR code generated and downloaded");
  };

  const badgeOptions = [
    { level: "basic", name: "Basic Transparency", description: "Essential ESG metrics", color: "#9CA3AF" },
    { level: "advanced", name: "Advanced Transparency", description: "Comprehensive metrics with quarterly updates", color: "#60A5FA" },
    { level: "premium", name: "Premium Transparency", description: "Full supply chain visibility with real-time updates", color: "#8B5CF6" }
  ];

  return (
    <DashboardLayout>
      <div className="container p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Stakeholder Console</h1>
            <p className="text-muted-foreground">Manage ESG performance and transparency metrics</p>
          </div>
          <Button>
            <Share2 className="mr-2 h-4 w-4" />
            Share Report
          </Button>
        </div>

        <Tabs defaultValue="esg" className="space-y-6">
          <TabsList>
            <TabsTrigger value="esg">ESG Performance</TabsTrigger>
            <TabsTrigger value="transparency">Transparency Metrics</TabsTrigger>
            <TabsTrigger value="certifications">Certifications & Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="esg">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>ESG Metrics</CardTitle>
                  <CardDescription>
                    Environmental, Social, and Governance performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium">Environmental</h3>
                          <p className="text-xs text-muted-foreground">Carbon footprint, resource usage, waste management</p>
                        </div>
                        <span className="text-sm font-medium">{esgData.environmental}%</span>
                      </div>
                      <Slider 
                        value={[esgData.environmental]} 
                        max={100} 
                        step={1}
                        onValueChange={(value) => handleEsgChange('environmental', value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium">Social</h3>
                          <p className="text-xs text-muted-foreground">Labor practices, community engagement, diversity</p>
                        </div>
                        <span className="text-sm font-medium">{esgData.social}%</span>
                      </div>
                      <Slider 
                        value={[esgData.social]} 
                        max={100} 
                        step={1}
                        onValueChange={(value) => handleEsgChange('social', value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium">Governance</h3>
                          <p className="text-xs text-muted-foreground">Corporate structure, ethics, compliance</p>
                        </div>
                        <span className="text-sm font-medium">{esgData.governance}%</span>
                      </div>
                      <Slider 
                        value={[esgData.governance]} 
                        max={100} 
                        step={1}
                        onValueChange={(value) => handleEsgChange('governance', value[0])}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>ESG Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2">Overall ESG Score</h3>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <Progress 
                          value={(esgData.environmental + esgData.social + esgData.governance) / 3} 
                          className="h-2.5" 
                        />
                      </div>
                      <span className="ml-4 text-sm font-bold">
                        {Math.round((esgData.environmental + esgData.social + esgData.governance) / 3)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transparency">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Transparency Badge</CardTitle>
                  <CardDescription>
                    Shareable badge for public-facing materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-6">
                    <div className="w-36 h-36 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500/80 to-purple-600/80">
                      <div className="w-32 h-32 bg-white dark:bg-gray-900 rounded-full flex flex-col items-center justify-center">
                        <span className="text-xl font-bold">{transparencyLevel}%</span>
                        <span className="text-xs text-muted-foreground">Transparency</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Transparency Level</Label>
                        <span className="text-sm">{transparencyLevel}%</span>
                      </div>
                      <Slider 
                        value={[transparencyLevel]} 
                        max={100} 
                        step={5}
                        onValueChange={(value) => setTransparencyLevel(value[0])}
                      />
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" className="flex-1" onClick={handleCopyBadgeUrl}>
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy URL
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={generateQRCode}>
                        <QrCode className="mr-2 h-4 w-4" />
                        QR Code
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Badge Options</CardTitle>
                  <CardDescription>
                    Choose a transparency badge level for your website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {badgeOptions.map((badge) => (
                      <div 
                        key={badge.level}
                        className="border rounded-lg p-4 flex flex-col cursor-pointer hover:border-primary hover:bg-muted/40 transition-colors"
                        onClick={() => {
                          setTransparencyLevel(badge.level === "basic" ? 60 : badge.level === "advanced" ? 80 : 95);
                          toast.success(`${badge.name} badge selected`);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{badge.name}</h3>
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: badge.color }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {badge.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="certifications">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Certifications Status</CardTitle>
                  <CardDescription>
                    Track and display certification progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {certifications.map((cert, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium">{cert.name}</h3>
                          {cert.achieved ? (
                            <Badge className="bg-risk-safe">
                              <Check className="mr-1 h-3 w-3" /> Achieved
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">In progress</span>
                          )}
                        </div>
                        <Progress 
                          value={cert.progress} 
                          className="h-2"
                          indicatorClassName={cert.achieved ? "bg-risk-safe" : undefined}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Public Trust Profile</CardTitle>
                  <CardDescription>
                    Downloadable public profile for stakeholders
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Generate a comprehensive public profile that includes all of your 
                    ESG metrics, certifications, and transparency badges in a 
                    stakeholder-friendly format.
                  </p>
                  
                  <div className="grid gap-4 grid-cols-2">
                    <Button className="w-full" onClick={() => toast.success("Public profile downloaded")}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => toast.success("Embeddable badge code copied")}>
                      <Copy className="mr-2 h-4 w-4" />
                      Get Embed Code
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2">Trust Score</h3>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <Progress 
                          value={85}
                          className="h-2.5" 
                        />
                      </div>
                      <span className="ml-4 text-sm font-bold">85%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Based on certification status, ESG performance, and transparency metrics
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
