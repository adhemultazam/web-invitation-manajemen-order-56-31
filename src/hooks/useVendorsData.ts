
import { useState, useEffect } from "react";
import { Vendor } from "@/types/types";

export const useVendorsData = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadVendorsData = () => {
      setIsLoading(true);

      try {
        const savedVendors = localStorage.getItem('vendors');
        if (savedVendors) {
          const parsedVendors: Vendor[] = JSON.parse(savedVendors);
          setVendors(parsedVendors);
        } else {
          // Default vendors if none found
          const defaultVendors: Vendor[] = [
            { id: "v1", name: "Rizki Design", code: "RD", color: "#3b82f6", commission: 10 },
            { id: "v2", name: "Putri Digital", code: "PD", color: "#8b5cf6", commission: 15 }
          ];
          localStorage.setItem('vendors', JSON.stringify(defaultVendors));
          setVendors(defaultVendors);
        }
      } catch (error) {
        console.error("Error loading vendors data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVendorsData();
  }, []);

  return { vendors, isLoading };
};
