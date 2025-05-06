
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  id?: string;
}

export function ColorPicker({ color, onChange, id }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Standard color options
  const colorOptions = [
    "#9c84ff", "#8371e0", "#6554b5", // Purples
    "#60a5fa", "#3b82f6", "#1d4ed8", // Blues
    "#4ade80", "#22c55e", "#15803d", // Greens
    "#fb7185", "#e11d48", "#be123c", // Roses
    "#fbbf24", "#d97706", "#b45309", // Amber
    "#67e8f9", "#06b6d4", "#0891b2", // Cyan
    "#c4b5fd", "#8b5cf6", "#6d28d9", // Violet
    "#f87171", "#ef4444", "#b91c1c", // Red
    "#a3e635", "#84cc16", "#4d7c0f", // Lime
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className="w-10 h-10 p-0 border"
          style={{ backgroundColor: color }}
          aria-label="Pilih warna"
        >
          <span className="sr-only">Pilih warna</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="p-2">
          <div className="grid grid-cols-6 gap-2">
            {colorOptions.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                className="w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary"
                style={{ backgroundColor: colorOption }}
                onClick={() => {
                  onChange(colorOption);
                  setIsOpen(false);
                }}
                aria-label={`Set color to ${colorOption}`}
              />
            ))}
          </div>
          
          <div className="mt-3">
            <label htmlFor="custom-color" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Kustom:
            </label>
            <input
              type="color"
              id="custom-color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
