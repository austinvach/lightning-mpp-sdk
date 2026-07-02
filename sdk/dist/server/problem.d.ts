/**
 * RFC 9457 Problem Details for HTTP APIs.
 * https://www.rfc-editor.org/rfc/rfc9457
 */
export interface ProblemDetails {
    /** A URI reference that identifies the problem type. */
    type: string;
    /** A short, human-readable summary of the problem type. */
    title: string;
    /** The HTTP status code for this occurrence of the problem. */
    status: number;
    /** A human-readable explanation specific to this occurrence. */
    detail: string;
}
/**
 * An error that carries RFC 9457 Problem Details fields.
 * Throw this inside verify() handlers to produce structured error responses.
 */
export declare class ProblemDetailsError extends Error implements ProblemDetails {
    readonly type: string;
    readonly title: string;
    readonly status: number;
    readonly detail: string;
    constructor(problem: ProblemDetails);
}
/**
 * Converts a ProblemDetailsError (or any Error) into an RFC 9457 compliant
 * HTTP Response with Content-Type: application/problem+json.
 */
export declare function toProblemResponse(err: unknown): Response;
/** Problem type URI namespace for this SDK. */
export declare const ProblemType: {
    readonly InvalidPreimage: "https://mppx.dev/problems/invalid-preimage";
    readonly InvoiceExpired: "https://mppx.dev/problems/invoice-expired";
    readonly PreimageConsumed: "https://mppx.dev/problems/preimage-consumed";
    readonly DepositConsumed: "https://mppx.dev/problems/deposit-consumed";
    readonly InsufficientDeposit: "https://mppx.dev/problems/insufficient-deposit";
    readonly InvalidReturnInvoice: "https://mppx.dev/problems/invalid-return-invoice";
    readonly SessionNotFound: "https://mppx.dev/problems/session-not-found";
    readonly SessionClosed: "https://mppx.dev/problems/session-closed";
    readonly UnknownAction: "https://mppx.dev/problems/unknown-action";
};
//# sourceMappingURL=problem.d.ts.map