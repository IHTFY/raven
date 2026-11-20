import { checkPurchase, holdsToken } from './ads.js';

/**
 * Whether ad boxes are held back for a possible buyer. It starts as the stored token says and settles
 * when the loader has checked the token, so a rejected token brings the ordinary placement back.
 */
export function trackPurchase() {
  const purchase = $state({ held: holdsToken() });
  if (purchase.held) checkPurchase().then(() => (purchase.held = holdsToken()));
  return purchase;
}
