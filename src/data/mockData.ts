
export const riskAlerts = [
  {
    id: "1",
    title: "Critical supplier security breach",
    description:
      "TechSolutions Inc. reported a data breach affecting customer information. Assess impact on supply chain.",
    level: "high",
    time: "10 min ago",
  },
  {
    id: "2",
    title: "Supply chain disruption",
    description:
      "Potential shipping delays at Rotterdam port due to labor strike. Expected 2-3 day impact.",
    level: "medium",
    time: "2 hours ago",
  },
  {
    id: "3",
    title: "Compliance certificate expiring",
    description:
      "ISO 27001 certification for GlobalTech will expire in 15 days. Renewal process needed.",
    level: "low",
    time: "5 hours ago",
  },
  {
    id: "4",
    title: "ESG improvements confirmed",
    description:
      "EcoLogistics has achieved carbon neutrality in operations. Updated sustainability report available.",
    level: "safe",
    time: "Yesterday",
  },
];

export const supplierData = [
  {
    id: "1",
    name: "TechSolutions Inc.",
    country: "United States",
    category: "Hardware",
    riskScore: 82,
    complianceStatus: "breached",
    trustLevel: "verified",
  },
  {
    id: "2",
    name: "GlobalTech",
    country: "Germany",
    category: "Software",
    riskScore: 45,
    complianceStatus: "pending",
    trustLevel: "gold",
  },
  {
    id: "3",
    name: "EcoLogistics",
    country: "Netherlands",
    category: "Logistics",
    riskScore: 28,
    complianceStatus: "verified",
    trustLevel: "platinum",
  },
  {
    id: "4",
    name: "PrecisionParts",
    country: "Japan",
    category: "Manufacturing",
    riskScore: 67,
    complianceStatus: "pending",
    trustLevel: "gold",
  },
];

export const supplierNodes = [
  {
    id: "center",
    name: "Your Company",
    category: "HQ",
    country: "United States",
    riskScore: 15,
    group: 1,
  },
  {
    id: "supplier1",
    name: "TechSolutions",
    category: "Hardware",
    country: "United States",
    riskScore: 82,
    group: 2,
  },
  {
    id: "supplier2",
    name: "GlobalTech",
    category: "Software",
    country: "Germany",
    riskScore: 45,
    group: 2,
  },
  {
    id: "supplier3",
    name: "EcoLogistics",
    category: "Logistics",
    country: "Netherlands",
    riskScore: 28,
    group: 2,
  },
  {
    id: "supplier4",
    name: "PrecisionParts",
    category: "Manufacturing",
    country: "Japan",
    riskScore: 67,
    group: 2,
  },
  {
    id: "supplier5",
    name: "ChipTech",
    category: "Electronics",
    country: "Taiwan",
    riskScore: 55,
    group: 3,
  },
  {
    id: "supplier6",
    name: "RawMaterials",
    category: "Materials",
    country: "Australia",
    riskScore: 35,
    group: 3,
  },
  {
    id: "supplier7",
    name: "LogiFreight",
    category: "Shipping",
    country: "Singapore",
    riskScore: 48,
    group: 3,
  },
];

export const supplierLinks = [
  { source: "center", target: "supplier1", value: 5 },
  { source: "center", target: "supplier2", value: 4 },
  { source: "center", target: "supplier3", value: 3 },
  { source: "center", target: "supplier4", value: 3 },
  { source: "supplier1", target: "supplier5", value: 2 },
  { source: "supplier2", target: "supplier5", value: 2 },
  { source: "supplier3", target: "supplier7", value: 2 },
  { source: "supplier4", target: "supplier6", value: 2 },
  { source: "supplier4", target: "supplier7", value: 1 },
];

export const dashboardStats = [
  {
    title: "Total Suppliers",
    value: "124",
    description: "Last 30 days",
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Risk Score",
    value: "68%",
    description: "Average",
    trend: { value: 5, isPositive: false },
  },
  {
    title: "Compliance",
    value: "89%",
    description: "Standards met",
    trend: { value: 2, isPositive: true },
  },
  {
    title: "Alerts",
    value: "24",
    description: "Unresolved",
    trend: { value: 18, isPositive: false },
  },
];
