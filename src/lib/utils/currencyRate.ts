/**
 * Fetches the live USD to NGN exchange rate.
 * Uses 1-hour Next.js revalidation cache for performance and resilience.
 */
const DEFAULT_USD_NGN_RATE = 1327; // Fallback rate if API is unavailable

export async function getLiveUsdNgnRate(): Promise<number> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 } // Cache rate for 1 hour (3600 seconds)
    });

    if (!res.ok) {
      console.warn('Currency API returned non-200 status, using fallback rate.');
      return DEFAULT_USD_NGN_RATE;
    }

    const data = await res.json();
    if (data && data.rates && typeof data.rates.NGN === 'number' && data.rates.NGN > 0) {
      return data.rates.NGN;
    }

    return DEFAULT_USD_NGN_RATE;
  } catch (error) {
    console.error('Error fetching live USD/NGN exchange rate:', error);
    return DEFAULT_USD_NGN_RATE;
  }
}

/**
 * Converts Naira amount to USD equivalent formatted string ($XX.XX)
 */
export function convertNgnToUsd(nairaAmount: number, exchangeRate: number): string {
  if (nairaAmount <= 0) return '$0';
  const usdVal = nairaAmount / exchangeRate;
  return `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
