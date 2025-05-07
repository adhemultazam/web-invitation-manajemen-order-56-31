
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function PasswordInput({ 
  value, 
  onChange, 
  required = false,
  id = "password",
  placeholder,
  disabled = false
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        <span className="sr-only">
          {showPassword ? "Sembunyikan password" : "Tampilkan password"}
        </span>
      </Button>
    </div>
  );
}
