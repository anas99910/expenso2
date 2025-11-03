
export const formatCurrency = (amount: number): string => {
  const numberFormatter = new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${numberFormatter.format(amount)} DH`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

export const getDaysInMonth = (year: number, month: number): number => new Date(year, month + 1, 0).getDate();

export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getWeekRange = (date: Date): { start: string, end: string } => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    // Fix: Rename `mon` to `start` to match the return object property.
    const start = new Date(d.setDate(diff)).toISOString().split('T')[0];
    // Fix: Rename `sun` to `end` to match the return object property.
    const end = new Date(d.setDate(d.getDate() + 6)).toISOString().split('T')[0];
    return { start, end };
};