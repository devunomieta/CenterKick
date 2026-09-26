/**
 * Single source of truth for "does this participant have platform access?".
 *
 * Historically this logic was copy-pasted (and drifted) across the dashboard
 * middleware, the dashboard layout, and the profile editor. A coupon/sponsorship
 * redemption sets `profiles.subscription_status` (and, via the app fallback,
 * `profiles.is_subscribed`) but never creates a row in `subscriptions` or
 * `transactions`, so any check that only looked at those tables treated a
 * fully-sponsored user as unsubscribed.
 *
 * NOTE: expiry (`profiles.valid_until`) is intentionally NOT enforced here yet.
 * None of the original call sites checked it and a `coupon_redemptions` row is
 * permanent, so enforcing it now would only half-work. When expiry handling is
 * tackled, do it here so every call site picks it up at once.
 */

const SPONSORED_SUBSCRIPTION_STATUSES = ['ACTIVE', 'SPONSORED', 'GIFT_COVERED'] as const;

export interface SubscriptionSignals {
  /** `profiles.is_subscribed` flag */
  isSubscribedFlag?: boolean | null;
  /** `profiles.subscription_status` */
  subscriptionStatus?: string | null;
  /** A row in `subscriptions` with status = 'active' exists for this user */
  hasActiveSubscriptionRow?: boolean;
  /** A confirmed row in `transactions` exists for this user */
  hasConfirmedTransaction?: boolean;
  /** A row in `coupon_redemptions` for this user exists */
  hasCouponRedemption?: boolean;
}

export function resolveIsSubscribed(signals: SubscriptionSignals): boolean {
  const status = (signals.subscriptionStatus || '').toUpperCase();
  return (
    signals.hasActiveSubscriptionRow === true ||
    signals.isSubscribedFlag === true ||
    (SPONSORED_SUBSCRIPTION_STATUSES as readonly string[]).includes(status) ||
    signals.hasConfirmedTransaction === true ||
    signals.hasCouponRedemption === true
  );
}
