/**
 * Polymarket CLOB Service
 * Handles trading operations with remote builder signing
 */

import { ClobClient, Side } from '@polymarket/clob-client';
import { BuilderConfig } from '@polymarket/builder-signing-sdk';
import type { Wallet } from '@ethersproject/wallet';
import type { JsonRpcSigner } from '@ethersproject/providers';
import type { ClobCredentials, OrderParams } from '@/types/trading';

const CLOB_API_URL = process.env.NEXT_PUBLIC_CLOB_API_URL || 'https://clob.polymarket.com';
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '137');
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:4000';

export class ClobService {
  private client: ClobClient | null = null;
  private static instance: ClobService;

  private constructor() {}

  static getInstance(): ClobService {
    if (!ClobService.instance) {
      ClobService.instance = new ClobService();
    }
    return ClobService.instance;
  }

  /**
   * Derive L2 API credentials from user's wallet signature
   * This is a one-time operation per wallet
   */
  async deriveApiCredentials(signer: Wallet | JsonRpcSigner): Promise<ClobCredentials> {
    try {
      console.log('Deriving CLOB API credentials...');

      // Create temporary client to derive credentials
      const tempClient = new ClobClient(
        CLOB_API_URL,
        CHAIN_ID,
        signer,
        undefined, // No credentials yet
        2 // Signature type: POLY_GNOSIS_SAFE
      );

      const derived = await tempClient.deriveApiKey();

      const credentials: ClobCredentials = {
        key: derived.key,
        secret: derived.secret,
        passphrase: derived.passphrase,
      };

      console.log('✅ CLOB credentials derived successfully');
      return credentials;
    } catch (error) {
      console.error('Failed to derive CLOB credentials:', error);
      throw new Error('Failed to generate trading credentials. Please try again.');
    }
  }

  /**
   * Initialize CLOB client with user credentials and remote signing
   */
  async initialize(
    signer: Wallet | JsonRpcSigner,
    credentials: ClobCredentials,
    funderAddress?: string
  ): Promise<void> {
    try {
      console.log('Initializing CLOB client...');
      console.log('- CLOB URL:', CLOB_API_URL);
      console.log('- Chain ID:', CHAIN_ID);
      console.log('- Funder:', funderAddress || 'Not set');

      // Create builder config for remote signing
      const builderConfig = new BuilderConfig({
        remoteBuilderConfig: {
          url: `${BACKEND_URL}/api/polymarket/sign`,
        },
      });

      this.client = new ClobClient(
        CLOB_API_URL,
        CHAIN_ID,
        signer,
        credentials,
        2, // Signature type: POLY_GNOSIS_SAFE
        funderAddress,
        undefined, // geoBlockToken
        undefined, // useServerTime
        builderConfig
      );

      console.log('✅ CLOB client initialized with remote signing');
    } catch (error) {
      console.error('Failed to initialize CLOB client:', error);
      throw new Error('Failed to initialize trading client.');
    }
  }

  /**
   * Check if client is ready for trading
   */
  isReady(): boolean {
    return this.client !== null;
  }

  /**
   * Create a market order
   */
  async createOrder(params: OrderParams): Promise<any> {
    if (!this.client) {
      throw new Error('CLOB client not initialized. Please complete setup first.');
    }

    try {
      console.log('Creating order:', params);

      // Validate parameters
      if (params.price < 0 || params.price > 1) {
        throw new Error('Price must be between 0.00 and 1.00');
      }

      if (params.size <= 0) {
        throw new Error('Size must be greater than 0');
      }

      const order = await this.client.createOrder({
        tokenID: params.tokenID,
        price: params.price,
        size: params.size,
        side: params.side === 'BUY' ? Side.BUY : Side.SELL,
      });

      console.log('✅ Order created:', order);
      return order;
    } catch (error: any) {
      console.error('Failed to create order:', error);

      // Parse error message
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to place order';
      throw new Error(errorMessage);
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderID: string): Promise<void> {
    if (!this.client) {
      throw new Error('CLOB client not initialized');
    }

    try {
      console.log('Cancelling order:', orderID);
      await this.client.cancelOrder({ orderID });
      console.log('✅ Order cancelled');
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      throw new Error(error?.message || 'Failed to cancel order');
    }
  }

  /**
   * Get order book for a token
   */
  async getOrderBook(tokenID: string): Promise<any> {
    if (!this.client) {
      throw new Error('CLOB client not initialized');
    }

    try {
      const orderBook = await this.client.getOrderBook(tokenID);
      return orderBook;
    } catch (error: any) {
      console.error('Failed to get order book:', error);
      throw new Error(error?.message || 'Failed to load order book');
    }
  }

  /**
   * Get specific order by ID
   */
  async getOrderById(orderID: string): Promise<any> {
    if (!this.client) {
      throw new Error('CLOB client not initialized');
    }

    try {
      const order = await this.client.getOrder(orderID);
      return order;
    } catch (error: any) {
      console.error('Failed to get order:', error);
      return null;
    }
  }

  /**
   * Reset the client (for logout/disconnect)
   */
  reset(): void {
    this.client = null;
    console.log('CLOB client reset');
  }
}

// Export singleton instance
export const clobService = ClobService.getInstance();
