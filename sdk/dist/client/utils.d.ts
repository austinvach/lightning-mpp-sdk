import { NETWORK_MAP } from '../constants.js';
export { NETWORK_MAP };
/**
 * Minimal wallet interface used internally by charge/session methods.
 *
 * Using a structural interface instead of `InstanceType<typeof SparkWallet>`
 * directly avoids TypeScript incompatibility errors when a pre-initialized
 * wallet from a different module resolution copy of @buildonspark/spark-sdk
 * is passed in (e.g. from a consuming app's own node_modules).
 */
export interface WalletLike {
    payLightningInvoice(params: {
        invoice: string;
        maxFeeSats: number;
        preferSpark: boolean;
    }): Promise<{
        id: string;
        paymentPreimage?: string;
        status?: string;
        userRequest?: {
            id?: string;
            paymentPreimage?: string;
            status?: string;
        };
    }>;
    getLightningSendRequest(id: string): Promise<{
        paymentPreimage?: string;
        status?: string;
    } | null>;
    getTransfer?(id: string): Promise<{
        status?: string;
        userRequest?: {
            id?: string;
            paymentPreimage?: string;
            status?: string;
        };
    } | undefined>;
    createLightningInvoice(params: {
        amountSats: number;
        memo: string;
        expirySeconds: number;
        includeSparkInvoice: boolean;
    }): Promise<{
        invoice: {
            encodedInvoice: string;
        };
    }>;
    cleanupConnections(): Promise<void>;
}
/**
 * Polls the wallet for the payment preimage after `payLightningInvoice`.
 * Spark sometimes returns the preimage asynchronously, so this retries until
 * the payment settles or the attempt limit is reached.
 */
export declare function resolvePreimage(wallet: WalletLike, result: Awaited<ReturnType<WalletLike['payLightningInvoice']>>, maxAttempts?: number, intervalMs?: number): Promise<string>;
//# sourceMappingURL=utils.d.ts.map