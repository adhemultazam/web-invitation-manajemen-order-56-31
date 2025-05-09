
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Label } from "@/components/ui/label";

interface DateSelectionFieldProps {
  label: string;
  date: Date | string | undefined;
  onDateChange: (date: Date | undefined) => void;
  id?: string;
  required?: boolean;
}

export function DateSelectionField({
  label,
  date,
  onDateChange,
  id,
  required = false,
}: DateSelectionFieldProps) {
  // Format the display date based on the input type (string or Date)
  const getFormattedDate = () => {
    if (!date) return null;
    
    if (typeof date === 'string') {
      // Only try to parse if it's a valid date string
      try {
        return format(parseISO(date), "PPP");
      } catch (e) {
        return null;
      }
    } else if (date instanceof Date) {
      return format(date, "PPP");
    }
    
    return null;
  };

  // Get the date object for the calendar
  const getDateObject = () => {
    if (!date) return undefined;
    
    if (typeof date === 'string') {
      try {
        return parseISO(date);
      } catch (e) {
        return undefined;
      }
    }
    
    return date;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required && " *"}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={`w-full justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getFormattedDate() || "Pilih tanggal"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={getDateObject()}
            onSelect={onDateChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
