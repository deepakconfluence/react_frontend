/**
 * App-wide constant values. Mirrors Angular `AppConsts.ts`.
 */
export const AppConsts = {
  userManagement: {
    defaultAdminUserName: 'admin',
  },
  localization: {
    defaultLocalizationSourceName: 'enterprise',
  },
  authorization: {
    encryptedAuthTokenName: 'enc_auth_token',
  },
  grid: {
    defaultPageSize: 10,
    defaultPageSizes: [5, 10, 20, 50, 100],
  },
  minimumUpgradePaymentAmount: 1,
  recaptchaSiteKey: '',
  subscriptionExpireNotifyDayCount: 7,
  /** Paths to public resources */
  appBaseUrl: '/',
  remoteServiceBaseUrl: '/api',
} as const;
