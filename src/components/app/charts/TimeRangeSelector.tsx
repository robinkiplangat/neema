
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeRangeSelectorProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}

const TimeRangeSelector = ({ timeRange, onTimeRangeChange }: TimeRangeSelectorProps) => {
  return (
    <Select 
      value={timeRange} 
      onValueChange={onTimeRangeChange}
    >
      <SelectTrigger className="w-[120px] h-8 text-xs">
        <SelectValue placeholder="Time Range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="week">Weekly</SelectItem>
        <SelectItem value="month">Monthly</SelectItem>
        <SelectItem value="quarter">Quarterly</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TimeRangeSelector;
