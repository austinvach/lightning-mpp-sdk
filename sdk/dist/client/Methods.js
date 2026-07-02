import { charge as charge_ } from './Charge.js';
import { session as session_ } from './Session.js';
/**
 * Creates a Spark Lightning `charge` method for usage on the client.
 *
 * Intercepts 402 responses, pays the BOLT11 invoice using the Spark wallet,
 * and retries with the preimage credential automatically.
 *
 * @example
 * ```ts
 * import { Mppx, spark } from 'spark-mppx/client'
 *
 * const method = spark.charge({ mnemonic: process.env.MNEMONIC!, network: 'regtest' })
 * const mppx = Mppx.create({ methods: [method] })
 *
 * const response = await mppx.fetch('https://api.example.com/weather')
 * await method.cleanup() // release Spark connections so the process can exit
 * ```
 */
export function spark(parameters) {
    return charge_(parameters);
}
(function (spark) {
    /** Creates a Lightning `charge` method for one-shot BOLT11 invoice payments. */
    spark.charge = charge_;
    /** Creates a Lightning `session` method for prepaid metered-access payments. */
    spark.session = session_;
})(spark || (spark = {}));
