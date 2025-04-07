
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const billableHours = payload.find((p: any) => p.name === "Billable Hours")?.value || 0;
    const nonBillableHours = payload.find((p: any) => p.name === "Non-Billable")?.value || 0;
    const utilization = payload.find((p: any) => p.name === "Utilization %")?.value;
    const totalHours = billableHours + nonBillableHours;
    
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-medium mb-1">{label}</p>
        <div className="grid gap-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                <span>{entry.name}</span>
              </div>
              <span className="font-medium">
                {entry.name.includes('%') ? `${entry.value}%` : `${entry.value}h`}
              </span>
            </div>
          ))}
          {!payload.find((p: any) => p.name === "Utilization %") && totalHours > 0 && (
            <div className="mt-1 pt-1 border-t">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{totalHours}h</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
