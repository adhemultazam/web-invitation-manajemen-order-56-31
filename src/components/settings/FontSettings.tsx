
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup, SelectLabel } from "@/components/ui/select";

interface FontSettingsProps {
  headingFont: string;
  bodyFont: string;
  onHeadingFontChange: (font: string) => void;
  onBodyFontChange: (font: string) => void;
}

export function FontSettings({
  headingFont,
  bodyFont,
  onHeadingFontChange,
  onBodyFontChange,
}: FontSettingsProps) {
  const fontOptions = [
    { value: "Inter", label: "Inter (Default)" },
    { value: "Poppins", label: "Poppins" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Lato", label: "Lato" },
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Nunito", label: "Nunito" },
    { value: "Raleway", label: "Raleway" },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="heading-font">Font Judul</Label>
        <Select
          value={headingFont}
          onValueChange={onHeadingFontChange}
        >
          <SelectTrigger id="heading-font" className="w-full">
            <SelectValue placeholder="Pilih font judul" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Font Judul</SelectLabel>
              {fontOptions.map((font) => (
                <SelectItem key={`heading-${font.value}`} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body-font">Font Isi</Label>
        <Select
          value={bodyFont}
          onValueChange={onBodyFontChange}
        >
          <SelectTrigger id="body-font" className="w-full">
            <SelectValue placeholder="Pilih font isi" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Font Isi</SelectLabel>
              {fontOptions.map((font) => (
                <SelectItem key={`body-${font.value}`} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Font preview */}
      <div className="mt-2 p-3 border rounded-md">
        <h4 className="font-medium" style={{ fontFamily: headingFont }}>
          Preview Font Judul: {headingFont}
        </h4>
        <p className="text-sm mt-2" style={{ fontFamily: bodyFont }}>
          Preview Font Isi: {bodyFont}. This demonstrates how text will appear throughout the application using the selected font.
        </p>
      </div>
    </div>
  );
}
