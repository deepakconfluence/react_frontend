export interface Subscription {
  editionId: string;
  editionDisplayName: string;
  subscriptionEndDateUtc: string | null;
  isInTrialPeriod: boolean;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  amount: number;
  invoiceDate: string;
}
