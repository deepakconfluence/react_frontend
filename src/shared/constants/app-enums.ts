/**
 * App-wide enums. Mirrors Angular `AppEnums.ts`.
 */
export enum AppEditionExpireAction {
  DeactiveTenant = 1,
  AssignToAnotherEdition = 2,
}

export enum AppTimezoneScope {
  Application = 1,
  Tenant = 2,
  User = 4,
  All = Application | Tenant | User,
}

export enum AppFriendshipState {
  Accepted = 1,
  Blocked = 2,
}

export enum AppIncomeStatisticsDateInterval {
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
}

export enum SubscriptionStartType {
  Free = 1,
  Trial = 2,
  Paid = 3,
}

export enum SubscriptionPaymentGatewayType {
  Paypal = 1,
  Stripe = 2,
}

export enum SubscriptionPaymentType {
  RecurringAutomatic = 1,
  RecurringManual = 2,
  Manual = 3,
}
