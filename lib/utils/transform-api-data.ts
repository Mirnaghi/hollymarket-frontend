import { PolymarketMarket, PolymarketEvent } from '@/types/api';
import { MarketEvent } from '@/components/event-card';

/**
 * Parse array field that might be JSON string or array
 */
function parseArrayField(field: string[] | string): string[] {
  if (Array.isArray(field)) {
    return field;
  }
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Transform API market data to component format
 */
export function transformMarketToEvent(market: PolymarketMarket): MarketEvent {
  // Parse outcome prices (handle both array and JSON string)
  const outcomePrices = parseArrayField(market.outcomePrices);

  // Get YES price (first outcome)
  const yesPriceRaw = parseFloat(outcomePrices[0] || '0');
  const yesPrice = yesPriceRaw * 100;

  // Get NO price (second outcome or calculate)
  let noPrice: number;
  if (outcomePrices.length > 1) {
    noPrice = parseFloat(outcomePrices[1]) * 100;
  } else {
    noPrice = 100 - yesPrice;
  }

  // Format volume
  const formattedVolume = formatVolume(market.volume);

  // Format end date
  const endDate = formatEndDate(market.endDate);

  // Calculate 24h change (placeholder - would need historical data)
  const change24h = market.new ? Math.random() * 10 - 5 : undefined;

  return {
    id: market.id,
    title: market.question,
    category: market.category || 'Other',
    yesPrice: Math.round(yesPrice),
    noPrice: Math.round(noPrice),
    volume: formattedVolume,
    endDate,
    trending: market.featured || market.new,
    change24h
  };
}

/**
 * Transform multiple markets
 */
export function transformMarketsToEvents(markets: PolymarketMarket[]): MarketEvent[] {
  return markets.map(transformMarketToEvent);
}

/**
 * Transform event with markets to market events
 */
export function transformEventMarketsToEvents(event: PolymarketEvent): MarketEvent[] {
  return event.markets.map((market) => ({
    ...transformMarketToEvent(market),
    category: event.title, // Use event title as category
    icon: event.icon, // Use event icon
    image: event.image, // Use event image
    eventId: event.id // Store event ID for navigation
  }));
}

/**
 * Format volume for display
 */
function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(0)}K`;
  } else {
    return `$${volume}`;
  }
}

/**
 * Format end date for display
 */
function formatEndDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Check if date is in the past
  if (date < now) {
    return 'Ended';
  }

  // Format as "MMM DD, YYYY"
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };

  return date.toLocaleDateString('en-US', options);
}

/**
 * Get category from market
 */
export function getCategoryFromMarket(market: PolymarketMarket): string {
  if (market.category) {
    return market.category.toLowerCase();
  }

  // Try to infer category from question
  const question = market.question.toLowerCase();

  if (question.includes('bitcoin') || question.includes('crypto') || question.includes('ethereum')) {
    return 'crypto';
  }
  if (question.includes('nba') || question.includes('nfl') || question.includes('sport')) {
    return 'sports';
  }
  if (question.includes('election') || question.includes('president') || question.includes('political')) {
    return 'politics';
  }

  return 'entertainment';
}
