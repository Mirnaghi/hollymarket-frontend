import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('X-Token');
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('X-Token', token);
    }
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('X-Token');
    }
  }

  // Auth methods
  async signIn(email: string) {
    const { data } = await this.client.post('/auth/signin', { email });
    return data;
  }

  async verifyOtp(email: string, token: string) {
    const { data } = await this.client.post('/auth/verify', { email, token });
    if (data.success && data.data.accessToken) {
      this.setToken(data.data.accessToken);
    }
    return data;
  }

  async getCurrentUser() {
    const { data } = await this.client.get('/auth/me');
    return data;
  }

  async signOut() {
    const { data } = await this.client.post('/auth/signout');
    this.clearToken();
    return data;
  }

  // Markets methods
  async getTags() {
    const { data } = await this.client.get('/markets/tags');
    return data;
  }

  async getEvents(params?: {
    limit?: number;
    offset?: number;
    active?: boolean;
    closed?: boolean;
    archived?: boolean;
    tag_id?: string;
    ascending?: boolean;
  }) {
    const { data } = await this.client.get('/markets/events', { params });
    return data;
  }

  async getEventsByTag(
    tagId: string,
    params?: {
      limit?: number;
      offset?: number;
      active?: boolean;
      closed?: boolean;
      archived?: boolean;
      ascending?: boolean;
    }
  ) {
    const { data } = await this.client.get(`/markets/events/tag/${tagId}`, { params });
    return data;
  }

  async getEventBySlug(slug: string) {
    const { data } = await this.client.get(`/markets/events/${slug}`);
    return data;
  }

  async getEventById(id: string) {
    const { data } = await this.client.get(`/markets/events/${id}`);
    return data;
  }

  async getMarkets(params?: {
    limit?: number;
    offset?: number;
    active?: boolean;
    closed?: boolean;
    archived?: boolean;
    tag?: string;
  }) {
    const { data } = await this.client.get('/markets', { params });
    return data;
  }

  async getMarketBySlug(slug: string) {
    const { data } = await this.client.get(`/markets/slug/${slug}`);
    return data;
  }

  async getMarketById(id: string) {
    const { data } = await this.client.get(`/markets/${id}`);
    return data;
  }

  async searchMarkets(query: string) {
    const { data } = await this.client.get('/markets/search', { params: { q: query } });
    return data;
  }

  async getFeaturedMarkets() {
    const { data } = await this.client.get('/markets/featured');
    return data;
  }

  async getTrendingMarkets() {
    const { data } = await this.client.get('/markets/trending');
    return data;
  }

  // Trading methods
  async getOrderbook(tokenId: string, depth?: number) {
    const { data } = await this.client.get(`/trading/orderbook/${tokenId}`, {
      params: depth ? { depth } : undefined,
    });
    return data;
  }

  async getMarketPrice(tokenId: string) {
    const { data } = await this.client.get(`/trading/price/${tokenId}`);
    return data;
  }

  async getMidpointPrice(tokenId: string) {
    const { data } = await this.client.get(`/trading/midpoint/${tokenId}`);
    return data;
  }

  async getSpread(tokenId: string) {
    const { data } = await this.client.get(`/trading/spread/${tokenId}`);
    return data;
  }

  async getRecentTrades(tokenId: string, limit?: number) {
    const { data } = await this.client.get(`/trading/trades/${tokenId}`, {
      params: limit ? { limit } : undefined,
    });
    return data;
  }

  async getUserOrders(address: string) {
    const { data } = await this.client.get(`/trading/orders/${address}`);
    return data;
  }

  async createOrder(signedOrder: any) {
    const { data } = await this.client.post('/trading/order', signedOrder);
    return data;
  }

  async cancelOrder(orderID: string) {
    const { data } = await this.client.delete('/trading/order', { data: { orderID } });
    return data;
  }
}

export const apiClient = new ApiClient();
