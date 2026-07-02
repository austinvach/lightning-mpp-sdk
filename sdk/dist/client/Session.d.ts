import { Method } from 'mppx';
import { WalletLike } from './utils.js';
type ActiveSession = {
    /** paymentHash of the deposit invoice — the session identifier. */
    sessionId: string;
    /** Preimage of the deposit invoice — bearer secret for all session requests. */
    preimage: string;
};
/**
 * Creates a Lightning `session` method for usage on the client.
 *
 * Intercepts 402 responses and handles the full session lifecycle automatically:
 *   - On the first 402, pays the deposit invoice and opens a session.
 *   - On subsequent 402s, presents the preimage as a bearer token (no payment).
 *   - Call `method.close(fetch, url)` to close the session and trigger a refund.
 *   - Call `method.cleanup()` when done to close Spark websocket connections.
 *
 * Pass either `mnemonic` (SDK creates and owns the wallet) or `wallet` (use an
 * already-initialized wallet — useful when the caller manages wallet lifecycle
 * for other purposes such as balance queries).
 *
 * @example
 * ```ts
 * import { Mppx, spark } from 'spark-mppx/client'
 *
 * const method = spark.session({ mnemonic: process.env.MNEMONIC!, network: 'regtest' })
 * const mppx = Mppx.create({ methods: [method] })
 *
 * const response = await mppx.fetch('https://api.example.com/endpoint')
 * console.log(await response.json())
 *
 * await method.close(mppx.fetch, 'https://api.example.com/endpoint')
 * await method.cleanup()
 * ```
 */
export declare function session(parameters: session.Parameters): {
    readonly intent: "session";
    readonly name: "lightning";
    readonly schema: {
        readonly credential: {
            readonly payload: import("zod/mini").ZodMiniDiscriminatedUnion<[import("zod/mini").ZodMiniObject<{
                action: import("zod/mini").ZodMiniLiteral<"open">;
                preimage: import("zod/mini").ZodMiniString<string>;
                returnInvoice: import("zod/mini").ZodMiniString<string>;
            }, import("zod/v4/core").$strip>, import("zod/mini").ZodMiniObject<{
                action: import("zod/mini").ZodMiniLiteral<"bearer">;
                sessionId: import("zod/mini").ZodMiniString<string>;
                preimage: import("zod/mini").ZodMiniString<string>;
            }, import("zod/v4/core").$strip>, import("zod/mini").ZodMiniObject<{
                action: import("zod/mini").ZodMiniLiteral<"topUp">;
                sessionId: import("zod/mini").ZodMiniString<string>;
                topUpPreimage: import("zod/mini").ZodMiniString<string>;
            }, import("zod/v4/core").$strip>, import("zod/mini").ZodMiniObject<{
                action: import("zod/mini").ZodMiniLiteral<"close">;
                sessionId: import("zod/mini").ZodMiniString<string>;
                preimage: import("zod/mini").ZodMiniString<string>;
            }, import("zod/v4/core").$strip>], "action">;
        };
        readonly request: import("zod/mini").ZodMiniObject<{
            amount: import("zod/mini").ZodMiniString<string>;
            currency: import("zod/mini").ZodMiniString<string>;
            description: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
            unitType: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
            depositInvoice: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
            paymentHash: import("zod/mini").ZodMiniString<string>;
            depositAmount: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
            idleTimeout: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
        }, import("zod/v4/core").$strip>;
    };
} & {
    canHandleChallenge?: Method.CanHandleChallengeFn | undefined;
    context?: undefined;
    createCredential: Method.CreateCredentialFn<{
        readonly intent: "session";
        readonly name: "lightning";
        readonly schema: {
            readonly credential: {
                readonly payload: import("zod/mini").ZodMiniDiscriminatedUnion<[import("zod/mini").ZodMiniObject<{
                    action: import("zod/mini").ZodMiniLiteral<"open">;
                    preimage: import("zod/mini").ZodMiniString<string>;
                    returnInvoice: import("zod/mini").ZodMiniString<string>;
                }, import("zod/v4/core").$strip>, import("zod/mini").ZodMiniObject<{
                    action: import("zod/mini").ZodMiniLiteral<"bearer">;
                    sessionId: import("zod/mini").ZodMiniString<string>;
                    preimage: import("zod/mini").ZodMiniString<string>;
                }, import("zod/v4/core").$strip>, import("zod/mini").ZodMiniObject<{
                    action: import("zod/mini").ZodMiniLiteral<"topUp">;
                    sessionId: import("zod/mini").ZodMiniString<string>;
                    topUpPreimage: import("zod/mini").ZodMiniString<string>;
                }, import("zod/v4/core").$strip>, import("zod/mini").ZodMiniObject<{
                    action: import("zod/mini").ZodMiniLiteral<"close">;
                    sessionId: import("zod/mini").ZodMiniString<string>;
                    preimage: import("zod/mini").ZodMiniString<string>;
                }, import("zod/v4/core").$strip>], "action">;
            };
            readonly request: import("zod/mini").ZodMiniObject<{
                amount: import("zod/mini").ZodMiniString<string>;
                currency: import("zod/mini").ZodMiniString<string>;
                description: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
                unitType: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
                depositInvoice: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
                paymentHash: import("zod/mini").ZodMiniString<string>;
                depositAmount: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
                idleTimeout: import("zod/mini").ZodMiniOptional<import("zod/mini").ZodMiniString<string>>;
            }, import("zod/v4/core").$strip>;
        };
    }, Record<never, never>>;
} & {
    close: (fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>, url: string) => Promise<Response>;
    topUp: (fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>, url: string) => Promise<Response>;
    cleanup: () => Promise<void>;
    getSession: () => Pick<ActiveSession, "sessionId"> | null;
    resetSession: () => void;
};
export declare namespace session {
    /** Pass either `mnemonic` (SDK manages the wallet) or `wallet` (caller-managed). */
    type Parameters = {
        network?: 'mainnet' | 'regtest' | 'signet';
        maxFeeSats?: number;
        /** Whether to prefer Spark route when paying Lightning invoices. Defaults to `true`. */
        preferSpark?: boolean;
        /** Whether to include a Spark invoice when creating the return invoice. Defaults to `true`. */
        includeSparkInvoice?: boolean;
        /** Called at each step of the session lifecycle. Optional. */
        onProgress?: (event: ProgressEvent) => void;
    } & ({
        mnemonic: string;
        wallet?: undefined;
    } | {
        wallet: WalletLike;
        mnemonic?: undefined;
    });
    type ProgressEvent = 
    /** A new session is being opened; deposit payment is about to be made. */
    {
        type: 'opening';
        depositSats: number;
        amount: number;
    }
    /** An existing session is being resumed via bearer token (no payment). */
     | {
        type: 'bearer';
        amount: number;
    }
    /** Top-up payment is about to be made. */
     | {
        type: 'topping-up';
        topUpSats: number;
    }
    /** Top-up payment confirmed. */
     | {
        type: 'topped-up';
        topUpSats: number;
    };
}
export {};
//# sourceMappingURL=Session.d.ts.map