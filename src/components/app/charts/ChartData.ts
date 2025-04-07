
// Weekly data
export const weeklyData = [
  { name: "Mon", billable: 6.5, nonBillable: 1.5, target: 8, utilization: 81 },
  { name: "Tue", billable: 7.8, nonBillable: 0.8, target: 8, utilization: 97 },
  { name: "Wed", billable: 5.2, nonBillable: 2.4, target: 8, utilization: 65 },
  { name: "Thu", billable: 7.0, nonBillable: 1.0, target: 8, utilization: 87 },
  { name: "Fri", billable: 6.8, nonBillable: 1.2, target: 8, utilization: 85 },
  { name: "Sat", billable: 0.5, nonBillable: 0.2, target: 0, utilization: 0 },
  { name: "Sun", billable: 0, nonBillable: 0, target: 0, utilization: 0 },
];

// Monthly data
export const monthlyData = [
  { name: "Week 1", billable: 32.0, nonBillable: 6.3, target: 40, utilization: 80 },
  { name: "Week 2", billable: 35.4, nonBillable: 4.5, target: 40, utilization: 88 },
  { name: "Week 3", billable: 28.6, nonBillable: 8.2, target: 40, utilization: 71 },
  { name: "Week 4", billable: 33.8, nonBillable: 5.4, target: 40, utilization: 84 },
];

// Quarterly data
export const quarterlyData = [
  { name: "Jan", billable: 140, nonBillable: 24, target: 168, utilization: 83 },
  { name: "Feb", billable: 126, nonBillable: 30, target: 160, utilization: 78 },
  { name: "Mar", billable: 150, nonBillable: 18, target: 168, utilization: 89 },
];

export const getChartData = (timeRange: string) => {
  switch(timeRange) {
    case "week": return weeklyData;
    case "month": return monthlyData;
    case "quarter": return quarterlyData;
    default: return weeklyData;
  }
};
