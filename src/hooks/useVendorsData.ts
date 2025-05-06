
import { useState, useEffect } from "react";
import { Vendor } from "@/types/types";

export const useVendorsData = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load vendors from localStorage
    const loadVendors = () => {
      setIsLoading(true);
      try {
        const storedVendors = localStorage.getItem("vendors");
        if (storedVendors) {
          const parsedVendors = JSON.parse(storedVendors);
          setVendors(parsedVendors);
        }
      } catch (error) {
        console.error("Error loading vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVendors();
  }, []);

  return { vendors, isLoading };
};
