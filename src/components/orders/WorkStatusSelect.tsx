
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  // Find the current work status
  const currentStatus = workStatuses.find(ws => ws.name === value);
  
  // Get status color for styling
  const getStatusColorStyle = (statusName: string) => {
    const status = workStatuses.find(ws => ws.name === statusName);
    const color = status?.color || '#6366f1';
    return {
      backgroundColor: color,
      color: '#fff'
    };
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex justify-between w-full min-w-[120px]"
          style={getStatusColorStyle(value)}
          disabled={isDisabled}
        >
          <span className="truncate">{value || "Not set"}</span>
          <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {workStatuses.map((status) => (
          <DropdownMenuItem
            key={status.id}
            onClick={() => onChange(status.name)}
            className={status.name === value ? "font-medium" : ""}
          >
            {status.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkStatusSelect;
