
// Helper function to map month names to their numbers
export const getMonthNumber = (monthName: string): string => {
  const months: { [key: string]: string } = {
    'januari': '01',
    'februari': '02',
    'maret': '03',
    'april': '04',
    'mei': '05',
    'juni': '06',
    'juli': '07',
    'agustus': '08',
    'september': '09',
    'oktober': '10',
    'november': '11',
    'desember': '12'
  };
  
  return months[monthName.toLowerCase()] || '';
};

// Helper to get month translation
export const getMonthTranslation = (monthName: string): string => {
  const translations: { [key: string]: string } = {
    'januari': 'Januari',
    'februari': 'Februari',
    'maret': 'Maret',
    'april': 'April',
    'mei': 'Mei',
    'juni': 'Juni',
    'juli': 'Juli',
    'agustus': 'Agustus',
    'september': 'September',
    'oktober': 'Oktober',
    'november': 'November',
    'desember': 'Desember'
  };
  
  return translations[monthName.toLowerCase()] || 'Unknown Month';
};
