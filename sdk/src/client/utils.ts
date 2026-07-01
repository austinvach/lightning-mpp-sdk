import { NETWORK_MAP } from '../constants.js'

export { NETWORK_MAP }

/**
 * Minimal wallet interface used internally by charge/session methods.
 *
 * Using a structural interface instead of `InstanceType<typeof SparkWallet>`
 * directly avoids TypeScript incompatibility errors when a pre-initialized
 * wallet from a different module resolution copy of @buildonspark/spark-sdk
 * is passed in (e.g. from a consuming app's own node_modules).
 */
export interface WalletLike {
  payLightningInvoice(params: { invoice: string; maxFeeSats: number; preferSpark: boolean }): Promise<{
    id: string
    paymentPreimage?: string
    status?: string
    userRequest?: {
      id?: string
      paymentPreimage?: string
      status?: string
    }
  }>
  getLightningSendRequest(id: string): Promise<{ paymentPreimage?: string; status?: string } | null>
  getTransfer?(id: string): Promise<{
    status?: string
    userRequest?: {
      id?: string
      paymentPreimage?: string
      status?: string
    }
  } | undefined>
  createLightningInvoice(params: { amountSats: number; memo: string; expirySeconds: number, includeSparkInvoice: boolean }): Promise<{ invoice: { encodedInvoice: string } }>
  cleanupConnections(): Promise<void>
}

/**
 * Polls the wallet for the payment preimage after `payLightningInvoice`.
 * Spark sometimes returns the preimage asynchronously, so this retries until
 * the payment settles or the attempt limit is reached.
 */
export async function resolvePreimage(
  wallet: WalletLike,
  result: Awaited<ReturnType<WalletLike['payLightningInvoice']>>,
  maxAttempts = 30,
  intervalMs = 2000,
): Promise<string> {
  if ('paymentPreimage' in result && result.paymentPreimage) {
    return result.paymentPreimage
  }

  if (result.userRequest?.paymentPreimage) {
    return result.userRequest.paymentPreimage
  }

  if (!result.id) {
    throw new Error('Unexpected payLightningInvoice result format')
  }

  const FAILURE_STATUSES = new Set(['LIGHTNING_PAYMENT_FAILED', 'TRANSFER_FAILED', 'FAILED'])
  const isFailureStatus = (status: string): boolean => {
    const normalized = status.toUpperCase()
    return FAILURE_STATUSES.has(normalized)
      || normalized.includes('FAILED')
      || normalized.includes('EXPIRED')
      || normalized.includes('RETURNED')
  }

  const hasTransferHints = typeof result.userRequest !== 'undefined'
  const pollMode: 'lightning' | 'spark' = wallet.getTransfer && hasTransferHints ? 'spark' : 'lightning'

  for (let i = 0; i < maxAttempts; i++) {
    if (pollMode === 'lightning') {
      const req = await wallet.getLightningSendRequest(result.id)
      if (req?.paymentPreimage) return req.paymentPreimage
      if (req?.status && isFailureStatus(req.status)) {
        throw new Error(`Lightning payment failed: ${req.status}`)
      }
    } else {
      const transfer = await wallet.getTransfer!(result.id)
      const transferRequest = transfer?.userRequest

      if (transferRequest?.paymentPreimage) return transferRequest.paymentPreimage

      if (transferRequest?.id && transferRequest.id !== result.id) {
        const nestedReq = await wallet.getLightningSendRequest(transferRequest.id)
        if (nestedReq?.paymentPreimage) return nestedReq.paymentPreimage
        if (nestedReq?.status && isFailureStatus(nestedReq.status)) {
          throw new Error(`Lightning payment failed: ${nestedReq.status}`)
        }
      }

      if (transfer?.status && isFailureStatus(transfer.status)) {
        throw new Error(`Spark transfer failed: ${transfer.status}`)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  throw new Error('Timed out waiting for payment preimage')
}
