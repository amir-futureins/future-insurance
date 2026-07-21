/**
 * Market / forex indicators for the running ticker.
 * NOTE: these are ILLUSTRATIVE snapshot values. For real-time data, wire this to
 * a market API (e.g. Bank of Israel rates / a quotes provider) and refresh
 * client-side — the ticker component reads this array as-is.
 */

export interface MarketItem {
  label: string;
  value: string;
  /** percent/points change text, e.g. "+0.4%" */
  change?: string;
  dir: 'up' | 'down' | 'flat';
}

export const MARKET_ITEMS: MarketItem[] = [
  { label: 'USD/ILS', value: '₪3.68', change: '-0.3%', dir: 'down' },
  { label: 'EUR/ILS', value: '₪4.02', change: '+0.1%', dir: 'up' },
  { label: 'S&P 500', value: '5,430', change: '+0.8%', dir: 'up' },
  { label: 'ת״א 125', value: '2,140', change: '+0.5%', dir: 'up' },
  { label: 'ריבית תלבור', value: '4.5%', change: 'ללא שינוי', dir: 'flat' },
  { label: 'ריבית בנק ישראל', value: '4.5%', change: 'ללא שינוי', dir: 'flat' },
  { label: 'זהב', value: '$2,340', change: '+0.6%', dir: 'up' },
];
