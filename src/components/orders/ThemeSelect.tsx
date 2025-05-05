
import React, { useEffect, useState } from "react";
import { Theme } from "@/types/types";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeSelectProps {
  value: string;
  themes?: string[] | Theme[];
  isDisabled: boolean;
  onChange: (value: string) => void;
}

const ThemeSelect: React.FC<ThemeSelectProps> = ({
  value,
  themes = [],
  isDisabled,
  onChange,
}) => {
  // Save selected theme to localStorage when it changes
  useEffect(() => {
    try {
      if (value) {
        localStorage.setItem('last_selected_theme', value);
      }
    } catch (e) {
      console.error("Error saving theme to localStorage:", e);
    }
  }, [value]);

  // Get theme options either from string array or Theme objects
  const themeOptions = Array.isArray(themes) 
    ? (typeof themes[0] === 'string' 
      ? themes as string[]
      : (themes as Theme[]).map(theme => theme.name))
    : [];
  
  const [open, setOpen] = useState(false);

  const handleSelect = (themeValue: string) => {
    onChange(themeValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isDisabled}
          className="h-8 w-full text-xs py-0 px-2 justify-between"
        >
          {value || "Pilih tema..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Cari tema..." className="h-9" />
          <CommandList>
            <CommandEmpty>Tema tidak ditemukan</CommandEmpty>
            <CommandGroup>
              {themeOptions.map((theme) => (
                <CommandItem
                  key={theme}
                  value={theme}
                  onSelect={() => handleSelect(theme)}
                  className="text-sm cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === theme ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {theme}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeSelect;
