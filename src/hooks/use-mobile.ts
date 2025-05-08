
import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if screen is mobile size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for window resize events
    window.addEventListener("resize", checkMobile);
    
    // Clean up event listener
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
