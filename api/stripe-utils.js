const { getAdminSettings } = require('./_db')
const Stripe = require('stripe')

/**
 * Load Stripe configuration.
 * - Prefer per-admin settings stored in Supabase
 * - Fall back to environment variables if missing
 */
async function getStripeConfig() {
  try {
    const settings = await getAdminSettings()
    const sc = settings?.stripeConfig

    if (sc?.publishableKey && sc?.secretKey) {
      return {
        publishableKey: sc.publishableKey,
        secretKey: sc.secretKey,
        testMode: sc.mode === 'test',
        source: 'admin',
      }
    }
  } catch (e) {
    console.warn('[stripe-utils] failed to read admin settings, falling back to env:', e.message)
  }

  // Fall back to environment
  const secretKey = (process.env.STRIPE_SECRET_KEY || '').trim()
  const publishableKey = (process.env.STRIPE_PUBLISHABLE_KEY || '').trim()

  return {
    publishableKey: publishableKey || 'pk_test_fake_example',
    secretKey: secretKey || 'sk_test_fake_example',
    testMode: !(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY),
    source: 'environment',
  }
}

/**
 * Create a Stripe instance from the resolved config
 */
async function createStripeInstance() {
  const config = await getStripeConfig()

  if (!config.secretKey) {
    throw new Error('[stripe-utils] Missing Stripe secret key')
  }

  try {
    const masked = {
      ...config,
      secretKey: config.secretKey ? '***masked***' : null,
    }
    console.log('[stripe-utils] Using config:', masked)
  } catch {
    /* ignore logging errors */
  }

  return {
    stripe: new Stripe(config.secretKey, { apiVersion: '2023-10-16' }),
    config,
  }
}

module.exports = { getStripeConfig, createStripeInstance }
