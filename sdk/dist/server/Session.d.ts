import { Method, Store } from 'mppx';
import * as Methods from '../Methods.js';
/**
 * Creates a Lightning `session` method for usage on the server.
 *
 * Clients deposit a lump sum upfront via a BOLT11 invoice, then authenticate
 * each request by presenting the preimage as a bearer secret. Per-request cost
 * is deducted from the session balance. On close the server refunds any unspent
 * sats via a direct Spark transfer.
 *
 * @example
 * ```ts
 * import { Mppx, spark } from 'spark-mppx/server'
 *
 * const mppx = Mppx.create({
 *   methods: [spark.session({ mnemonic: process.env.MNEMONIC! })],
 * })
 *
 * export async function handler(request: Request) {
 *   const result = await mppx.session({ amount: '10', currency: 'sat' })(request)
 *   if (result.status === 402) return result.challenge
 *   return result.withReceipt(Response.json({ data: '...' }))
 * }
 * ```
 */
export declare function session(parameters: session.Parameters): Method.Server<typeof Methods.session> & {
    deduct: (sessionId: string, sats: number) => Promise<boolean>;
    waitForTopUp: (sessionId: string, timeoutMs?: number) => Promise<boolean>;
    serve: (options: session.serve.Options) => Response;
};
export declare namespace session {
    namespace serve {
        type Options = {
            /**
             * The original HTTP request. Used to extract the session ID and per-chunk
             * cost (from the echoed challenge's `amount` field) automatically.
             */
            request: Request;
            /** Async iterable of SSE data payloads (one string per chunk). */
            generate: AsyncIterable<string>;
            /**
             * Milliseconds to hold the connection open waiting for a top-up.
             * Defaults to 60 000 (60 seconds).
             */
            timeoutMs?: number;
        };
    }
    type Parameters = {
        /** BIP39 mnemonic for the receiving Spark wallet. */
        mnemonic: string;
        /** Lightning network. Defaults to 'mainnet'. */
        network?: 'mainnet' | 'regtest' | 'signet';
        /**
         * Exact deposit amount in satoshis. Sent to the client in the challenge so
         * it can display the deposit size before inspecting the invoice. When not
         * set, defaults to 20× the per-chunk `amount`.
         */
        depositAmount?: number;
        /**
         * Optional label for the unit being priced (e.g., "token", "chunk").
         * Forwarded to the client in the challenge request as `unitType`.
         */
        unitType?: string;
        /** Pluggable key-value store for session state. Defaults to in-memory. */
        store?: Store.Store;
        /** Whether to include a Spark invoice alongside BOLT11 invoices. Defaults to `true`. */
        includeSparkInvoice?: boolean;
        /**
         * Idle timeout in seconds. Sessions with no bearer or topUp activity for
         * this duration are automatically closed and the unspent balance refunded
         * to the client's return invoice. Defaults to 300 (5 minutes). Set to 0
         * to disable idle timeouts.
         */
        idleTimeout?: number;
    };
}
//# sourceMappingURL=Session.d.ts.map