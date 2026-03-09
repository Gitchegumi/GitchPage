// Financial formatting utilities for GitchPage

/**
 * Format a number as USD currency with two decimal places.
 * Examples: 5 -> "$5.00", 100.5 -> "$100.50", 1234.567 -> "$1,234.57"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Parse a currency string (with $ and commas) to a number.
 * Examples: "$5.00" -> 5, "$1,234.56" -> 1234.56
 */
export function parseCurrency(str: string): number {
  if (!str) return 0;
  // Remove everything except digits and decimal point
  const cleaned = str.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format a number as a compact currency (e.g., $1.2K, $1.5M)
 * Useful for large totals in dashboards.
 */
export function formatCurrencyCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  } else if (abs >= 1_000) {
    return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  } else {
    return formatCurrency(amount);
  }
}
