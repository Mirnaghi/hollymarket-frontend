/**
 * Trading types for Polymarket CLOB integration
 */

export interface ClobCredentials {
  key: string;
  secret: string;
  passphrase: string;
}

export interface TradingSetupStatus {
  isWalletConnected: boolean;
  walletAddress: string | null;
  chainId: number | null;

  hasCredentials: boolean;
  credentials: ClobCredentials | null;

  isReadyToTrade: boolean;
  isLoading: boolean;
  error: string | null;
  currentStep: 'disconnected' | 'connecting' | 'connected' | 'generating-credentials' | 'ready' | 'error';
}

export interface OrderParams {
  tokenID: string;
  price: number; // 0.00 - 1.00
  size: number; // Number of shares
  side: 'BUY' | 'SELL';
}

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

export interface OrderBookLevel {
  price: string;
  size: string;
}

export interface OrderBook {
  market: string;
  asset_id: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: number;
}
