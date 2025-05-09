
import { Image } from "lucide-react";

interface BrandLogoProps {
  logo?: string;
  name: string;
  size?: number; // Added size prop
}

export function BrandLogo({ logo, name, size = 16 }: BrandLogoProps) {
  const sizeClass = `h-${size} w-${size}`;
  const iconSize = Math.floor(size * 0.75);
  const iconSizeClass = `h-${iconSize} w-${iconSize}`;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`${sizeClass} rounded-full overflow-hidden border shadow-sm bg-white dark:bg-gray-800 flex items-center justify-center`}>
        {logo ? (
          <img 
            src={logo} 
            alt={`${name} Logo`} 
            className={`h-${Math.floor(size * 0.75)} w-${Math.floor(size * 0.75)} object-contain`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
              console.error("Failed to load logo:", logo);
            }}
          />
        ) : (
          <Image className={iconSizeClass + " text-wedding-primary"} />
        )}
      </div>
    </div>
  );
}
