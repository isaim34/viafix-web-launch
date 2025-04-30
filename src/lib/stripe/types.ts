
export interface CheckoutSessionOptions {
  paymentType: 'featured' | 'messages' | 'subscription';
  quantity?: number;
  planType?: string;
}

export interface CheckoutResult {
  url: string | null;
  error: string | null;
  authError?: boolean;
}

export interface PortalResult {
  url: string | null;
  error: string | null;
  authError?: boolean;
}

export interface SubscriptionResult {
  subscribed: boolean;
  subscription_tier?: string | null;
  subscription_end?: string | null;
  error: string | null;
  authError?: boolean;
}
