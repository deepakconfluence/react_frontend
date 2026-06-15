export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  gateway: 'stripe' | 'paypal';
}
