
import { useState, useEffect } from "react";
import { WorkStatus, Addon, Package, Theme } from "@/types/types";

export const useOrderResources = () => {
  const [workStatuses, setWorkStatuses] = useState<WorkStatus[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadResources = async () => {
      setIsLoading(true);
      try {
        // Load work statuses from localStorage
        const storedWorkStatuses = localStorage.getItem("workStatuses");
        if (storedWorkStatuses && isMounted) {
          const parsedWorkStatuses = JSON.parse(storedWorkStatuses);
          setWorkStatuses(parsedWorkStatuses);
        }

        // Load addons from localStorage
        const storedAddons = localStorage.getItem("addons");
        if (storedAddons && isMounted) {
          const parsedAddons = JSON.parse(storedAddons);
          setAddons(parsedAddons);
        }

        // Load themes from localStorage
        const storedThemes = localStorage.getItem("themes");
        if (storedThemes && isMounted) {
          const parsedThemes = JSON.parse(storedThemes);
          
          // Convert string themes to object themes if necessary
          const processedThemes = parsedThemes.map((theme: any) => {
            if (typeof theme === 'string') {
              return { id: crypto.randomUUID(), name: theme, thumbnail: "", category: "" };
            }
            return theme;
          });
          
          setThemes(processedThemes);
        }

        // Load packages from localStorage
        const storedPackages = localStorage.getItem("packages");
        if (storedPackages && isMounted) {
          const parsedPackages = JSON.parse(storedPackages);
          setPackages(parsedPackages);
        }
      } catch (error) {
        console.error("Error loading order resources:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadResources();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  return { workStatuses, addons, themes, packages, isLoading };
};
