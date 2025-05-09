
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Index() {
  const [loaded, setLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wedding-primary"></div>
      </div>
    );
  }

  return (
    <div className={`w-full ${isMobile ? "px-1" : "px-4"}`}>
      <Dashboard />
    </div>
  );
}
