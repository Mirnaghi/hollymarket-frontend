/**
 * Trading setup hook for Polymarket CLOB
 * Manages the complete trading setup flow
 */

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useEthersSigner } from '@/lib/utils/ethers';
import { clobService } from '@/lib/services/clob.service';
import type { TradingSetupStatus, ClobCredentials } from '@/types/trading';

const POLYGON_CHAIN_ID = 137;
const CREDENTIALS_STORAGE_KEY = 'polymarket_clob_credentials';

export function useTradingSetup() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const signer = useEthersSigner({ chainId });

  const [status, setStatus] = useState<TradingSetupStatus>({
    isWalletConnected: false,
    walletAddress: null,
    chainId: null,
    hasCredentials: false,
    credentials: null,
    isReadyToTrade: false,
    isLoading: false,
    error: null,
    currentStep: 'disconnected',
  });

  // Load credentials from localStorage on mount
  useEffect(() => {
    const loadCredentials = () => {
      if (typeof window === 'undefined' || !address) return;

      try {
        const stored = localStorage.getItem(`${CREDENTIALS_STORAGE_KEY}_${address.toLowerCase()}`);
        if (stored) {
          const credentials: ClobCredentials = JSON.parse(stored);
          setStatus(prev => ({
            ...prev,
            credentials,
            hasCredentials: true,
          }));
        }
      } catch (error) {
        console.error('Failed to load stored credentials:', error);
      }
    };

    loadCredentials();
  }, [address]);

  // Update wallet connection status
  useEffect(() => {
    setStatus(prev => ({
      ...prev,
      isWalletConnected: isConnected && !!address,
      walletAddress: address || null,
      chainId: chainId || null,
      currentStep: isConnected && address ? 'connected' : 'disconnected',
    }));
  }, [isConnected, address, chainId]);

  // Check if ready to trade
  useEffect(() => {
    const isReady =
      status.isWalletConnected &&
      status.chainId === POLYGON_CHAIN_ID &&
      status.hasCredentials &&
      clobService.isReady();

    setStatus(prev => ({
      ...prev,
      isReadyToTrade: isReady,
    }));
  }, [status.isWalletConnected, status.chainId, status.hasCredentials]);

  /**
   * Generate CLOB API credentials
   * User needs to sign a message once
   */
  const generateCredentials = useCallback(async () => {
    if (!signer || !address) {
      throw new Error('Wallet not connected');
    }

    if (status.chainId !== POLYGON_CHAIN_ID) {
      throw new Error('Please switch to Polygon network');
    }

    setStatus(prev => ({ ...prev, isLoading: true, error: null, currentStep: 'generating-credentials' }));

    try {
      // Derive credentials from wallet signature
      const credentials = await clobService.deriveApiCredentials(signer);

      // Store credentials
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `${CREDENTIALS_STORAGE_KEY}_${address.toLowerCase()}`,
          JSON.stringify(credentials)
        );
      }

      setStatus(prev => ({
        ...prev,
        credentials,
        hasCredentials: true,
        isLoading: false,
        currentStep: 'ready',
      }));

      return credentials;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to generate credentials';
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        currentStep: 'error',
      }));
      throw error;
    }
  }, [signer, address, status.chainId]);

  /**
   * Initialize CLOB client for trading
   */
  const initializeTradingClient = useCallback(async () => {
    if (!signer || !address) {
      throw new Error('Wallet not connected');
    }

    if (!status.credentials) {
      throw new Error('Credentials not generated. Please complete setup first.');
    }

    setStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Initialize CLOB client with credentials
      await clobService.initialize(signer, status.credentials, address);

      setStatus(prev => ({
        ...prev,
        isLoading: false,
        isReadyToTrade: true,
        currentStep: 'ready',
      }));
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to initialize trading client';
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        currentStep: 'error',
      }));
      throw error;
    }
  }, [signer, address, status.credentials]);

  /**
   * Complete setup flow: generate credentials + initialize client
   */
  const completeSetup = useCallback(async () => {
    try {
      // Step 1: Generate credentials if not already done
      let creds = status.credentials;
      if (!status.hasCredentials) {
        creds = await generateCredentials();
      }

      // Step 2: Initialize trading client
      if (creds && signer) {
        await clobService.initialize(signer, creds, address);
        setStatus(prev => ({
          ...prev,
          isReadyToTrade: true,
          currentStep: 'ready',
        }));
      }
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  }, [status.credentials, status.hasCredentials, generateCredentials, signer, address]);

  /**
   * Reset setup (on disconnect or error)
   */
  const reset = useCallback(() => {
    clobService.reset();
    setStatus({
      isWalletConnected: false,
      walletAddress: null,
      chainId: null,
      hasCredentials: false,
      credentials: null,
      isReadyToTrade: false,
      isLoading: false,
      error: null,
      currentStep: 'disconnected',
    });
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setStatus(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...status,
    generateCredentials,
    initializeTradingClient,
    completeSetup,
    reset,
    clearError,
    isCorrectChain: chainId === POLYGON_CHAIN_ID,
    requiredChainId: POLYGON_CHAIN_ID,
  };
}
