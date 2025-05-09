
export const indonesianMonths = [
  "januari", "februari", "maret", "april", "mei", "juni",
  "juli", "agustus", "september", "oktober", "november", "desember"
];

export const isValidMonth = (month: string): boolean => {
  return indonesianMonths.includes(month.toLowerCase());
};

export const getMonthTitle = (month: string): string => {
  const normalizedMonth = month.toLowerCase();
  if (indonesianMonths.includes(normalizedMonth)) {
    return normalizedMonth.charAt(0).toUpperCase() + normalizedMonth.slice(1);
  }
  return "Pesanan Bulanan";
};

export const getPreviousMonth = (month: string, year: string): { month: string; year: string } => {
  const monthIndex = indonesianMonths.findIndex(m => m.toLowerCase() === month.toLowerCase());
  
  if (monthIndex === -1) {
    return { month, year }; // Return the same if invalid
  }
  
  // Calculate previous month and year
  let prevMonthIndex = monthIndex - 1;
  let prevYear = year;
  
  if (prevMonthIndex < 0) {
    prevMonthIndex = 11; // December
    prevYear = (parseInt(year) - 1).toString();
  }
  
  return {
    month: indonesianMonths[prevMonthIndex],
    year: prevYear
  };
};
