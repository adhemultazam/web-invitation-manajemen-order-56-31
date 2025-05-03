
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkStatus } from "@/types/types";

interface WorkStatusSelectProps {
  value: string;
  isDisabled: boolean;
  workStatuses: WorkStatus[];
  onChange: (value: string) => void;
}

const WorkStatusSelect: React.FC<WorkStatusSelectProps> = ({
  value,
  isDisabled,
  workStatuses,
  onChange,
}) => {
  const getStatusColor = (status: string): string => {
    const workStatus = workStatuses.find(ws => ws.name === status);
    return workStatus ? workStatus.color : '#6E6E6E'; // Default gray if not found
  };

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={isDisabled}
    >
      <SelectTrigger className="h-8 w-full text-xs py-0 px-2">
        <div className="flex items-center">
          <div
            className="w-2 h-2 mr-1 rounded-full"
            style={{ backgroundColor: getStatusColor(value) }}
          />
          <SelectValue>{value}</SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {workStatuses.map((status) => (
          <SelectItem key={status.id} value={status.name}>
            <div className="flex items-center">
              <div
                className="w-2 h-2 mr-2 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              {status.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default WorkStatusSelect;
