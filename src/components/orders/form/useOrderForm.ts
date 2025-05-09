
import { useState } from "react";
import { Order } from "@/types/types";
import { format } from "date-fns";

export function useOrderForm(initialData: Partial<Order> = {}) {
  const [customerName, setCustomerName] = useState(initialData.customerName || "");
  const [clientName, setClientName] = useState(initialData.clientName || "");
  const [clientUrl, setClientUrl] = useState(initialData.clientUrl || "");
  const [orderDate, setOrderDate] = useState<Date | string>(
    initialData.orderDate ? new Date(initialData.orderDate) : new Date()
  );
  const [eventDate, setEventDate] = useState<Date | string | undefined>(
    initialData.eventDate ? new Date(initialData.eventDate) : undefined
  );
  const [vendor, setVendor] = useState(initialData.vendor || "");
  const [selectedPackage, setSelectedPackage] = useState(initialData.package || "");
  const [theme, setTheme] = useState(initialData.theme || "");
  const [addons, setAddons] = useState<string[]>(
    Array.isArray(initialData.addons) ? initialData.addons : []
  );
  const [paymentStatus, setPaymentStatus] = useState<"Pending" | "Lunas">(
    initialData.paymentStatus || "Pending"
  );
  const [paymentAmount, setPaymentAmount] = useState(
    initialData.paymentAmount !== undefined ? initialData.paymentAmount : ""
  );
  const [workStatus, setWorkStatus] = useState(initialData.workStatus || "");
  const [notes, setNotes] = useState(initialData.notes || "");
  
  // Helper for formatting currency input
  const formatPaymentAmount = (value: string): string => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Format as currency with thousands separator
    if (numericValue) {
      return new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
      }).format(Number(numericValue));
    }
    
    return '';
  };

  // Handle currency input changes
  const handlePaymentAmountChange = (value: string) => {
    // If input is cleared, reset the state
    if (!value) {
      setPaymentAmount('');
      return;
    }
    
    // Remove formatting and store numeric value
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Store formatted value in state
    setPaymentAmount(formatPaymentAmount(numericValue));
  };

  // Update package and associated data
  const handlePackageChange = (packageValue: string, packages: any[] = []) => {
    setSelectedPackage(packageValue);
    
    // Optionally update payment amount based on package price
    if (packages.length > 0) {
      const selectedPkg = packages.find(pkg => pkg.name === packageValue);
      if (selectedPkg && selectedPkg.price) {
        setPaymentAmount(formatPaymentAmount(String(selectedPkg.price)));
      }
    }
  };

  // Prepare form data for submission
  const getFormData = (): Order => {
    // Clean payment amount
    let amount = paymentAmount;
    if (typeof amount === 'string') {
      amount = amount.replace(/[^0-9.]/g, '');
    }
    
    return {
      id: initialData.id || '',
      customerName,
      clientName,
      clientUrl,
      orderDate: typeof orderDate === 'object' 
        ? format(orderDate, 'yyyy-MM-dd') 
        : orderDate,
      eventDate: eventDate 
        ? (typeof eventDate === 'object' 
          ? format(eventDate, 'yyyy-MM-dd') 
          : eventDate) 
        : '',
      vendor,
      package: selectedPackage,
      theme,
      addons,
      paymentStatus,
      paymentAmount: amount,
      workStatus,
      notes,
      countdownDays: initialData.countdownDays || 0
    };
  };
  
  return {
    // Form state
    customerName,
    setCustomerName,
    clientName,
    setClientName,
    clientUrl,
    setClientUrl,
    orderDate,
    setOrderDate,
    eventDate,
    setEventDate,
    vendor,
    setVendor,
    selectedPackage,
    setSelectedPackage,
    theme,
    setTheme,
    addons,
    setAddons,
    paymentStatus,
    setPaymentStatus,
    paymentAmount,
    workStatus,
    setWorkStatus,
    notes,
    setNotes,
    // Form handlers
    handlePaymentAmountChange,
    handlePackageChange,
    getFormData
  };
}
