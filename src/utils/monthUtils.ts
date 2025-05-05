
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
