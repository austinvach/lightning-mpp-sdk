import { NETWORK_MAP } from '../constants.js';
export { NETWORK_MAP };
/**
 * Polls the wallet for the payment preimage after `payLightningInvoice`.
 * Spark sometimes returns the preimage asynchronously, so this retries until
 * the payment settles or the attempt limit is reached.
 */
export async function resolvePreimage(wallet, result, maxAttempts = 30, intervalMs = 2000) {
    if ('paymentPreimage' in result && result.paymentPreimage) {
        return result.paymentPreimage;
    }
    if (result.userRequest?.paymentPreimage) {
        return result.userRequest.paymentPreimage;
    }
    if (!result.id) {
        throw new Error('Unexpected payLightningInvoice result format');
    }
    const FAILURE_STATUSES = new Set(['LIGHTNING_PAYMENT_FAILED', 'TRANSFER_FAILED', 'FAILED']);
    const isFailureStatus = (status) => {
        const normalized = status.toUpperCase();
        return FAILURE_STATUSES.has(normalized)
            || normalized.includes('FAILED')
            || normalized.includes('EXPIRED')
            || normalized.includes('RETURNED');
    };
    const hasTransferHints = typeof result.userRequest !== 'undefined';
    const pollMode = wallet.getTransfer && hasTransferHints ? 'spark' : 'lightning';
    for (let i = 0; i < maxAttempts; i++) {
        if (pollMode === 'lightning') {
            const req = await wallet.getLightningSendRequest(result.id);
            if (req?.paymentPreimage)
                return req.paymentPreimage;
            if (req?.status && isFailureStatus(req.status)) {
                throw new Error(`Lightning payment failed: ${req.status}`);
            }
        }
        else {
            const transfer = await wallet.getTransfer(result.id);
            const transferRequest = transfer?.userRequest;
            if (transferRequest?.paymentPreimage)
                return transferRequest.paymentPreimage;
            if (transferRequest?.id && transferRequest.id !== result.id) {
                const nestedReq = await wallet.getLightningSendRequest(transferRequest.id);
                if (nestedReq?.paymentPreimage)
                    return nestedReq.paymentPreimage;
                if (nestedReq?.status && isFailureStatus(nestedReq.status)) {
                    throw new Error(`Lightning payment failed: ${nestedReq.status}`);
                }
            }
            if (transfer?.status && isFailureStatus(transfer.status)) {
                throw new Error(`Spark transfer failed: ${transfer.status}`);
            }
        }
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    throw new Error('Timed out waiting for payment preimage');
}
