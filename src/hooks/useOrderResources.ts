
import { useState, useEffect } from "react";
import { WorkStatus, Addon, Package, Theme } from "@/types/types";

export const useOrderResources = () => {
  const [workStatuses, setWorkStatuses] = useState<WorkStatus[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResources = () => {
      setIsLoading(true);
      try {
        // Load work statuses from localStorage
        const storedWorkStatuses = localStorage.getItem("workStatuses");
        if (storedWorkStatuses) {
          const parsedWorkStatuses = JSON.parse(storedWorkStatuses);
          setWorkStatuses(parsedWorkStatuses);
        }

        // Load addons from localStorage
        const storedAddons = localStorage.getItem("addons");
        if (storedAddons) {
          const parsedAddons = JSON.parse(storedAddons);
          setAddons(parsedAddons);
        }

        // Load themes from localStorage
        const storedThemes = localStorage.getItem("themes");
        if (storedThemes) {
          const parsedThemes = JSON.parse(storedThemes);
          setThemes(parsedThemes);
        }

        // Load packages from localStorage
        const storedPackages = localStorage.getItem("packages");
        if (storedPackages) {
          const parsedPackages = JSON.parse(storedPackages);
          setPackages(parsedPackages);
        }
      } catch (error) {
        console.error("Error loading order resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();
  }, []);

  return { workStatuses, addons, themes, packages, isLoading };
};
