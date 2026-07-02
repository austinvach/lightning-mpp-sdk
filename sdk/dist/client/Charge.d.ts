import { Method } from 'mppx';
import { WalletLike } from './utils.js';
/**
 * Creates a Lightning `charge` method for usage on the client.
 *
 * Intercepts 402 responses, pays the BOLT11 invoice in the challenge using the
 * Spark wallet, and retries with the preimage as the credential.
 *
 * Pass either `mnemonic` (SDK creates and owns the wallet) or `wallet` (use an
 * already-initialized wallet — useful when the caller manages wallet lifecycle
 * for other purposes such as balance queries).
 *
 * @example
 * ```ts
 * import { Mppx, spark } from 'spark-mppx/client'
 *
 * const mppx = Mppx.create({
 *   polyfill: false,
 *   methods: [spark.charge({ mnemonic: process.env.MNEMONIC! })],
 * })
 *
 * const response = await mppx.fetch('https://api.example.com/weather')
 * console.log(await response.json())
 * ```
 */
export declare function charge(parameters: charge.Parameters): {
    readonly intent: "charge";
    readonly name: "lightning";
    readonly schema: {
        readonly credential: {
            readonly payload: import("zod/mini").ZodMiniObject<{
                preimage: import("zod/mini").ZodMiniString<string>;
            }, import("zod/v4/core").$strip>;
        };
        readonly request: import("zod/mini").ZodMiniObject<{
            amount: import("zod/mini").ZodMiniString<string>;
            currency: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
            description: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
            methodDetails: import("zod/mini").ZodMiniObject<{
                invoice: import("zod/mini").ZodMiniString<string>;
                paymentHash: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
                network: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
            }, import("zod/v4/core").$strip>;
        }, import("zod/v4/core").$strip>;
    };
} & {
    canHandleChallenge?: Method.CanHandleChallengeFn | undefined;
    context?: undefined;
    createCredential: Method.CreateCredentialFn<{
        readonly intent: "charge";
        readonly name: "lightning";
        readonly schema: {
            readonly credential: {
                readonly payload: import("zod/mini").ZodMiniObject<{
                    preimage: import("zod/mini").ZodMiniString<string>;
                }, import("zod/v4/core").$strip>;
            };
            readonly request: import("zod/mini").ZodMiniObject<{
                amount: import("zod/mini").ZodMiniString<string>;
                currency: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
                description: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
                methodDetails: import("zod/mini").ZodMiniObject<{
                    invoice: import("zod/mini").ZodMiniString<string>;
                    paymentHash: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
                    network: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
                }, import("zod/v4/core").$strip>;
            }, import("zod/v4/core").$strip>;
        };
    }, Record<never, never>>;
} & {
    cleanup: () => Promise<void>;
};
export declare namespace charge {
    /** Pass either `mnemonic` (SDK manages the wallet) or `wallet` (caller-managed). */
    type Parameters = {
        network?: 'mainnet' | 'regtest' | 'signet';
        maxFeeSats?: number;
        /** Whether to prefer Spark route when paying Lightning invoices. Defaults to `true`. */
        preferSpark?: boolean;
        /** Called at each step of the payment process. Optional. */
        onProgress?: (event: ProgressEvent) => void;
    } & ({
        mnemonic: string;
        wallet?: undefined;
    } | {
        wallet: WalletLike;
        mnemonic?: undefined;
    });
    type ProgressEvent = {
        type: 'challenge';
        invoice: string;
        amountSats: number;
    } | {
        type: 'paying';
    } | {
        type: 'paid';
        preimage: string;
    };
}
//# sourceMappingURL=Charge.d.ts.map