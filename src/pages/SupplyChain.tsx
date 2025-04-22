
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SupplyChainMap } from "@/components/dashboard/SupplyChainMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Filter, Search } from "lucide-react";
import { supplierNodes, supplierLinks } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SupplyChain() {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [riskThreshold, setRiskThreshold] = useState<number | null>(null);
  
  // Extract unique countries and categories from nodes
  const countries = [...new Set(supplierNodes.map(node => node.country))];
  const categories = [...new Set(supplierNodes.map(node => node.category))];
  
  // Apply filters to nodes
  const filteredNodes = supplierNodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(node.country);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(node.category);
    const matchesRisk = riskThreshold === null || node.riskScore >= riskThreshold;
    
    return matchesSearch && matchesCountry && matchesCategory && matchesRisk;
  });
  
  // Get the IDs of filtered nodes
  const filteredNodeIds = filteredNodes.map(node => node.id);
  
  // Filter links to only include connections between filtered nodes
  const filteredLinks = supplierLinks.filter(link => 
    filteredNodeIds.includes(link.source as string) && 
    filteredNodeIds.includes(link.target as string)
  );
  
  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country) 
        : [...prev, country]
    );
  };
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCountries([]);
    setSelectedCategories([]);
    setRiskThreshold(null);
  };
  
  const getNodeStats = () => {
    const totalNodes = filteredNodes.length;
    const highRiskNodes = filteredNodes.filter(node => node.riskScore >= 70).length;
    const tier1Suppliers = filteredNodes.filter(node => node.group === 2).length;
    const tier2Suppliers = filteredNodes.filter(node => node.group === 3).length;
    
    return { totalNodes, highRiskNodes, tier1Suppliers, tier2Suppliers };
  };
  
  const stats = getNodeStats();

  return (
    <DashboardLayout>
      <div className="container p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Supply Chain Network</h1>
          <Button variant="outline">
            Export Map
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Network Filters</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search nodes..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Country
                    {selectedCountries.length > 0 && (
                      <Badge className="ml-2" variant="secondary">{selectedCountries.length}</Badge>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {countries.map(country => (
                    <DropdownMenuCheckboxItem
                      key={country}
                      checked={selectedCountries.includes(country)}
                      onCheckedChange={() => handleCountryToggle(country)}
                    >
                      {country}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Category
                    {selectedCategories.length > 0 && (
                      <Badge className="ml-2" variant="secondary">{selectedCategories.length}</Badge>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {categories.map(category => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Select 
                value={riskThreshold?.toString() || ""} 
                onValueChange={(value) => setRiskThreshold(value ? parseInt(value) : null)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Risk Threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Risk Level</SelectItem>
                  <SelectItem value="70">High Risk (70+)</SelectItem>
                  <SelectItem value="50">Medium Risk (50+)</SelectItem>
                  <SelectItem value="30">Low Risk (30+)</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNodes}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalNodes === supplierNodes.length 
                  ? 'All suppliers visible' 
                  : `${stats.totalNodes} of ${supplierNodes.length} suppliers`}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">High Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highRiskNodes}</div>
              <p className="text-xs text-muted-foreground">
                Suppliers with risk score 70+
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tier 1 Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tier1Suppliers}</div>
              <p className="text-xs text-muted-foreground">
                Direct suppliers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tier 2 Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tier2Suppliers}</div>
              <p className="text-xs text-muted-foreground">
                Indirect suppliers
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="network" className="space-y-4">
          <TabsList>
            <TabsTrigger value="network">Network Graph</TabsTrigger>
            <TabsTrigger value="connections">Connection List</TabsTrigger>
          </TabsList>
          <TabsContent value="network" className="h-[500px]">
            <SupplyChainMap nodes={filteredNodes} links={filteredLinks} />
          </TabsContent>
          <TabsContent value="connections">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Supply Chain Connections</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left px-4 py-2">Source</th>
                        <th className="text-left px-4 py-2">Target</th>
                        <th className="text-left px-4 py-2">Strength</th>
                        <th className="text-left px-4 py-2">Risk Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLinks.map((link, index) => {
                        const sourceNode = supplierNodes.find(node => node.id === link.source);
                        const targetNode = supplierNodes.find(node => node.id === link.target);
                        
                        if (!sourceNode || !targetNode) return null;
                        
                        // Calculate a connection risk score (average of both nodes)
                        const connectionRisk = Math.round((sourceNode.riskScore + targetNode.riskScore) / 2);
                        
                        return (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="px-4 py-2">{sourceNode.name}</td>
                            <td className="px-4 py-2">{targetNode.name}</td>
                            <td className="px-4 py-2">{link.value * 20}%</td>
                            <td className="px-4 py-2">
                              <span 
                                className={`px-2 py-1 rounded text-xs ${
                                  connectionRisk >= 70 ? 'bg-risk-high/20 text-risk-high' :
                                  connectionRisk >= 50 ? 'bg-risk-medium/20 text-risk-medium' :
                                  connectionRisk >= 30 ? 'bg-risk-low/20 text-risk-low' :
                                  'bg-risk-safe/20 text-risk-safe'
                                }`}
                              >
                                {connectionRisk}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
