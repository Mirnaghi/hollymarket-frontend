// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  createdAt: string;
  lastSignInAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Tag types (defined before Event types since events reference tags)
export interface PolymarketTag {
  id: string;
  name: string;
  label?: string; // Display label (if different from name)
  slug: string;
  description?: string;
  eventCount?: number;
  marketCount?: number;
}

// Event types
export interface PolymarketEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  markets: PolymarketMarket[];
  tags?: (string | PolymarketTag)[]; // Can be string array or tag objects
  commentCount?: number;
  liquidity?: number;
  volume?: number;
}

// Market types
export interface PolymarketMarket {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  resolutionSource: string;
  endDate: string;
  liquidity: number;
  volume: number;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  submitted_by: string;
  outcomes: string[] | string; // Can be array or JSON string
  outcomePrices: string[] | string; // Can be array or JSON string
  clobTokenIds: string[] | string; // Can be array or JSON string
  description?: string;
  category?: string;
  marketMakerAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Orderbook types
export interface OrderbookLevel {
  price: string;
  size: string;
}

export interface OrderbookSummary {
  market: string;
  asset_id: string;
  hash: string;
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  timestamp: number;
}

// Order types
export interface Order {
  id: string;
  market: string;
  asset_id: string;
  owner: string;
  side: 'BUY' | 'SELL';
  price: string;
  size: string;
  filled_size: string;
  remaining_size: string;
  status: 'LIVE' | 'MATCHED' | 'CANCELLED' | 'EXPIRED';
  created_at: number;
  updated_at: number;
  expiration: number;
}

// Trade types
export interface Trade {
  id: string;
  market: string;
  asset_id: string;
  side: 'BUY' | 'SELL';
  price: string;
  size: string;
  timestamp: number;
  maker_address: string;
  taker_address?: string;
}

// Price types
export interface MarketPrice {
  market: string;
  asset_id: string;
  price: string;
  timestamp: number;
}

export interface SpreadData {
  tokenId: string;
  bid: string;
  ask: string;
  spread: string;
}

// Get Events Params
export interface GetEventsParams {
  limit?: number;
  offset?: number;
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  tag_id?: string;
  ascending?: boolean;
}
