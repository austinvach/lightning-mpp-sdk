import { charge as charge_ } from './Charge.js';
import { session as session_ } from './Session.js';
/**
 * Creates `spark` Lightning methods for usage on the server.
 *
 * @example
 * ```ts
 * import { Mppx, spark } from 'spark-mppx/server'
 *
 * const mppx = Mppx.create({
 *   methods: [spark.charge({ mnemonic: process.env.MNEMONIC! })],
 * })
 * ```
 */
export declare function spark(parameters: spark.Parameters): ReturnType<typeof charge_>;
export declare namespace spark {
    type Parameters = charge_.Parameters;
    /** Creates a Lightning `charge` method for BOLT11 invoice payments. */
    const charge: typeof charge_;
    /** Creates a Lightning `session` method for prepaid metered-access payments. */
    const session: typeof session_;
}
//# sourceMappingURL=Methods.d.ts.map