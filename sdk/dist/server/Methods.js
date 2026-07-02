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
export function spark(parameters) {
    return spark.charge(parameters);
}
(function (spark) {
    /** Creates a Lightning `charge` method for BOLT11 invoice payments. */
    spark.charge = charge_;
    /** Creates a Lightning `session` method for prepaid metered-access payments. */
    spark.session = session_;
})(spark || (spark = {}));
