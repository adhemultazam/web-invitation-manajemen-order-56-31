
import { format } from "date-fns";
import { UserMenu } from "./UserMenu";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

export function TopBar() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const isMobile = useIsMobile();
  const today = new Date();
  const formattedDate = format(today, "EEEE, d MMMM yyyy", { locale: require("date-fns/locale/id") });

  // Capitalize the first letter of the day
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Hide on mobile as we already have the mobile navigation
  if (isMobile) return null;

  return (
    <div className={cn(
      "w-full border-b px-4 py-2 flex items-center justify-between",
      isDarkMode ? "bg-gray-800/40 border-gray-700" : "bg-white border-gray-200"
    )}>
      <div className="text-sm font-medium">
        {capitalizedDate}
      </div>
      <div>
        <UserMenu />
      </div>
    </div>
  );
}
