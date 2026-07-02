import { z } from 'mppx';
/**
 * Lightning Network charge method — shared schema used by both server and client.
 *
 * The challenge request carries a BOLT11 invoice so the client knows exactly
 * what to pay. The credential payload carries the preimage, which the server
 * verifies with sha256(preimage) == paymentHash.
 */
export declare const charge: {
    readonly intent: "charge";
    readonly name: "lightning";
    readonly schema: {
        readonly credential: {
            readonly payload: z.ZodMiniObject<{
                preimage: z.ZodMiniString<string>;
            }, z.core.$strip>;
        };
        readonly request: z.ZodMiniObject<{
            amount: z.ZodMiniString<string>;
            currency: z.ZodMiniOptional<z.ZodMiniString<string>>;
            description: z.ZodMiniOptional<z.ZodMiniString<string>>;
            methodDetails: z.ZodMiniObject<{
                /** Full BOLT11-encoded payment request. Authoritative source for payment parameters. */
                invoice: z.ZodMiniString<string>;
                /** SHA-256 hash of the preimage, lowercase hex. Convenience field — MUST match invoice. */
                paymentHash: z.ZodMiniOptional<z.ZodMiniString<string>>;
                /** Lightning Network identifier. Convenience field — MUST match invoice's network prefix. */
                network: z.ZodMiniOptional<z.ZodMiniString<string>>;
            }, z.core.$strip>;
        }, z.core.$strip>;
    };
};
/**
 * Lightning Network session method — shared schema used by both server and client.
 *
 * Implements a prepaid session model: the client deposits a lump sum upfront via
 * a BOLT11 invoice, then authenticates each subsequent request by presenting the
 * payment preimage as a bearer secret. The server tracks spent/available balances
 * in a pluggable store. On close, the server refunds unspent sats via a 0-amount
 * BOLT11 return invoice provided by the client at open time.
 *
 * Actions:
 *   open   — first request; proves deposit payment and registers return invoice
 *   bearer — ongoing requests; presents preimage as bearer token
 *   topUp  — re-deposit; proves a new invoice was paid and adds to session balance
 *   close  — end of session; triggers refund to the return invoice
 *
 * Security note on the bearer preimage:
 *   The payment preimage is a 32-byte random secret known only to the payer (the
 *   Lightning network reveals it only upon payment settlement). Using it directly
 *   as a bearer token allows the server to verify ownership with a single SHA-256
 *   check against the stored paymentHash — without ever storing the secret itself.
 *   An alternative (per-request HMAC tokens) would require the server to store the
 *   preimage, which is a worse security posture. TLS is assumed; the preimage has
 *   the same threat model as any API bearer token.
 */
export declare const session: {
    readonly intent: "session";
    readonly name: "lightning";
    readonly schema: {
        readonly credential: {
            readonly payload: z.ZodMiniDiscriminatedUnion<[z.ZodMiniObject<{
                action: z.ZodMiniLiteral<"open">;
                /** sha256-preimage proving the deposit invoice was paid. */
                preimage: z.ZodMiniString<string>;
                /** 0-amount BOLT11 invoice — server pays unspent balance to this on close. */
                returnInvoice: z.ZodMiniString<string>;
            }, z.core.$strip>, z.ZodMiniObject<{
                action: z.ZodMiniLiteral<"bearer">;
                /** paymentHash of the original deposit invoice, identifies the session. */
                sessionId: z.ZodMiniString<string>;
                /** Same preimage as open — bearer secret proving session ownership. */
                preimage: z.ZodMiniString<string>;
            }, z.core.$strip>, z.ZodMiniObject<{
                action: z.ZodMiniLiteral<"topUp">;
                /** paymentHash of the original deposit invoice, identifies the session. */
                sessionId: z.ZodMiniString<string>;
                /** Preimage of the top-up invoice — proves the top-up payment was made. */
                topUpPreimage: z.ZodMiniString<string>;
            }, z.core.$strip>, z.ZodMiniObject<{
                action: z.ZodMiniLiteral<"close">;
                /** paymentHash of the original deposit invoice, identifies the session. */
                sessionId: z.ZodMiniString<string>;
                /** Same preimage as open — bearer secret proving session ownership. */
                preimage: z.ZodMiniString<string>;
            }, z.core.$strip>], "action">;
        };
        readonly request: z.ZodMiniObject<{
            /** Cost per unit of service in satoshis. */
            amount: z.ZodMiniString<string>;
            currency: z.ZodMiniString<string>;
            description: z.ZodMiniOptional<z.ZodMiniString<string>>;
            /** Optional label for the unit being priced (e.g., "token", "chunk"). */
            unitType: z.ZodMiniOptional<z.ZodMiniString<string>>;
            /**
             * BOLT11 deposit invoice. Present on open/topUp challenges; absent on bearer/close challenges
             * where no payment is required (spec §6 depositInvoice field).
             */
            depositInvoice: z.ZodMiniOptional<z.ZodMiniString<string>>;
            /** sha256 hash of the deposit invoice preimage. Used to verify open/topUp credentials. */
            paymentHash: z.ZodMiniString<string>;
            /**
             * Deposit amount in satoshis. Always equals the amount encoded in depositInvoice.
             * Informs the client of the exact deposit size before it inspects the invoice.
             */
            depositAmount: z.ZodMiniOptional<z.ZodMiniString<string>>;
            /**
             * Server's idle timeout policy in seconds. When present, informs the client
             * how long the server will retain an open session without activity before
             * initiating a server-side close and refund. Informational only.
             */
            idleTimeout: z.ZodMiniOptional<z.ZodMiniString<string>>;
        }, z.core.$strip>;
    };
};
//# sourceMappingURL=Methods.d.ts.map