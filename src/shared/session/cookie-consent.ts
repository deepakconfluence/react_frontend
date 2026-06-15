const CONSENT_KEY = 'cookie-consent-accepted';

export const cookieConsent = {
  hasAccepted(): boolean {
    return window.localStorage.getItem(CONSENT_KEY) === 'true';
  },
  accept(): void {
    window.localStorage.setItem(CONSENT_KEY, 'true');
  },
  reset(): void {
    window.localStorage.removeItem(CONSENT_KEY);
  },
};
