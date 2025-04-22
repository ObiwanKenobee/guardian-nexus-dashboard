
import { Supplier } from "@/types/supplier";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Globe, UserCheck, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskScorecardProps {
  supplier: Supplier;
}

export function RiskScorecard({ supplier }: RiskScorecardProps) {
  // Generate some mock risk categories for the supplier
  const riskCategories = [
    {
      name: "Financial Health",
      score: Math.max(20, Math.min(100, supplier.riskScore + (Math.random() * 20 - 10))),
      trend: Math.random() > 0.5 ? "up" : "down"
    },
    {
      name: "Compliance",
      score: Math.max(20, Math.min(100, supplier.riskScore + (Math.random() * 20 - 10))),
      trend: Math.random() > 0.5 ? "up" : "down"
    },
    {
      name: "Geopolitical",
      score: Math.max(20, Math.min(100, supplier.riskScore + (Math.random() * 20 - 10))),
      trend: Math.random() > 0.5 ? "up" : "down"
    },
    {
      name: "ESG Performance",
      score: Math.max(20, Math.min(100, supplier.riskScore + (Math.random() * 20 - 10))),
      trend: Math.random() > 0.5 ? "up" : "down"
    }
  ];

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-risk-safe";
    if (score < 60) return "text-risk-low";
    if (score < 80) return "text-risk-medium";
    return "text-risk-high";
  };

  const getProgressClass = (score: number) => {
    if (score < 30) return "bg-risk-safe";
    if (score < 60) return "bg-risk-low";
    if (score < 80) return "bg-risk-medium";
    return "bg-risk-high";
  };

  const getRiskMitigationTips = (riskScore: number) => {
    if (riskScore >= 80) {
      return [
        "Immediate risk assessment required",
        "Develop contingency supply plans",
        "Schedule compliance audit within 7 days"
      ];
    } else if (riskScore >= 60) {
      return [
        "Conduct monthly performance reviews",
        "Diversify supply chain for critical components",
        "Request updated compliance documentation"
      ];
    } else {
      return [
        "Maintain regular monitoring",
        "Schedule quarterly review meetings",
        "Ensure documentation remains current"
      ];
    }
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{supplier.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Globe className="h-3 w-3 mr-1" />
              <span>{supplier.country}</span>
              <span className="mx-1">•</span>
              <span>{supplier.category}</span>
            </div>
          </div>
          <div className={cn(
            "text-xl font-bold rounded-md px-3 py-1",
            getRiskColor(supplier.riskScore),
            supplier.riskScore >= 80 ? "bg-risk-high/10" : 
            supplier.riskScore >= 60 ? "bg-risk-medium/10" : 
            supplier.riskScore >= 30 ? "bg-risk-low/10" : 
            "bg-risk-safe/10"
          )}>
            {supplier.riskScore}%
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-4">
          {riskCategories.map((category, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="text-sm">{category.name}</div>
                <div className="flex items-center">
                  {category.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-risk-high mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-risk-safe mr-1" />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    getRiskColor(category.score)
                  )}>
                    {Math.round(category.score)}%
                  </span>
                </div>
              </div>
              <Progress 
                value={category.score} 
                className="h-1" 
                indicatorClassName={getProgressClass(category.score)}
              />
            </div>
          ))}

          <div className="mt-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 mr-2 text-risk-medium" />
              <h4 className="font-medium text-sm">AI Risk Mitigation Suggestions</h4>
            </div>
            <ul className="pl-6 text-xs space-y-1 list-disc">
              {getRiskMitigationTips(supplier.riskScore).map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
