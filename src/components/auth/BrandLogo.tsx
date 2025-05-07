
import { Image } from "lucide-react";

interface BrandLogoProps {
  logo?: string;
  name: string;
}

export function BrandLogo({ logo, name }: BrandLogoProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="h-16 w-16 rounded-full overflow-hidden border shadow-sm bg-white dark:bg-gray-800 flex items-center justify-center">
        {logo ? (
          <img 
            src={logo} 
            alt={`${name} Logo`} 
            className="h-12 w-12 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
              console.error("Failed to load logo:", logo);
            }}
          />
        ) : (
          <Image className="h-8 w-8 text-wedding-primary" />
        )}
      </div>
    </div>
  );
}
