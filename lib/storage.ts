export const FREE_STORAGE_KEY = 'code-vivant:v3-free';
export const PREMIUM_STORAGE_PREFIX = 'code-vivant:v3-premium:';

export function premiumStorageKey(token: string) {
  return `${PREMIUM_STORAGE_PREFIX}${token}`;
}
