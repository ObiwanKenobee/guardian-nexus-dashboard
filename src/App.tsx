
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RiskIntelligence from "./pages/RiskIntelligence";
import ComplianceLedger from "./pages/ComplianceLedger";
import SupplyChain from "./pages/SupplyChain";
import Reporting from "./pages/Reporting";
import Stakeholders from "./pages/Stakeholders";
import Suppliers from "./pages/Suppliers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/risk" element={<RiskIntelligence />} />
            <Route path="/compliance" element={<ComplianceLedger />} />
            <Route path="/supply-chain" element={<SupplyChain />} />
            <Route path="/reports" element={<Reporting />} />
            <Route path="/stakeholders" element={<Stakeholders />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
