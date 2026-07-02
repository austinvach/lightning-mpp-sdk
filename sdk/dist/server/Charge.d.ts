import { Method, Store } from 'mppx';
/**
 * Creates a Lightning `charge` method for usage on the server.
 *
 * Generates a fresh BOLT11 invoice for each payment challenge using the Spark
 * wallet. Verifies payment by checking that sha256(preimage) == paymentHash.
 *
 * @example
 * ```ts
 * import { Mppx, spark } from 'spark-mppx/server'
 *
 * const mppx = Mppx.create({
 *   methods: [spark.charge({ mnemonic: process.env.MNEMONIC! })],
 * })
 *
 * export async function handler(request: Request) {
 *   const result = await mppx.charge({ amount: '100', currency: 'sat' })(request)
 *   if (result.status === 402) return result.challenge
 *   return result.withReceipt(Response.json({ data: '...' }))
 * }
 * ```
 */
export declare function charge(parameters: charge.Parameters): Method.Server<{
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
}, {}, undefined, {}, undefined>;
export declare namespace charge {
    type Parameters = {
        /** BIP39 mnemonic for the receiving Spark wallet. */
        mnemonic: string;
        /** Lightning network. Defaults to 'mainnet'. */
        network?: 'mainnet' | 'regtest' | 'signet';
        /**
         * Pluggable key-value store for consumed-preimage tracking (replay prevention).
         * Defaults to in-memory. Use a persistent store (e.g. Store.cloudflare, Store.upstash)
         * in production so that consumed preimages survive server restarts.
         */
        store?: Store.Store;
        /**
         * Whether to include a Spark invoice alongside the BOLT11 invoice.
         * Defaults to `true`. Set to `false` to disable Spark invoice generation.
         * See https://docs.spark.money/api-reference/wallet/create-lightning-invoice#param-include-spark-invoice
         */
        includeSparkInvoice?: boolean;
    };
}
//# sourceMappingURL=Charge.d.ts.map