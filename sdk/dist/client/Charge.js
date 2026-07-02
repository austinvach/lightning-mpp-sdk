import { SparkWallet } from '@buildonspark/spark-sdk';
import { decode as decodeBolt11 } from 'light-bolt11-decoder';
import { Credential, Method } from 'mppx';
import * as Methods from '../Methods.js';
import { NETWORK_MAP, resolvePreimage } from './utils.js';
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
export function charge(parameters) {
    const { maxFeeSats = 100, onProgress, preferSpark = true } = parameters;
    // If mnemonic is provided, we own the wallet and lazily initialise it.
    // If a pre-initialized wallet is provided, we use it directly.
    let walletPromise = null;
    function getWallet() {
        if (parameters.wallet !== undefined) {
            return Promise.resolve(parameters.wallet);
        }
        if (!walletPromise) {
            const { mnemonic, network = 'mainnet' } = parameters;
            walletPromise = SparkWallet.initialize({
                mnemonicOrSeed: mnemonic,
                options: { network: NETWORK_MAP[network] },
            }).then(({ wallet }) => wallet)
                .catch((e) => { walletPromise = null; throw e; });
        }
        return walletPromise;
    }
    const method = Method.toClient(Methods.charge, {
        async createCredential({ challenge }) {
            const wallet = await getWallet();
            const { amount, methodDetails } = challenge.request;
            const invoice = methodDetails.invoice;
            // Verify invoice fields match the challenge convenience fields (spec §7.2).
            const decoded = decodeBolt11(invoice);
            // Verify paymentHash convenience field matches invoice (MUST per spec).
            if (methodDetails.paymentHash) {
                const hashSection = decoded.sections.find((s) => s.name === 'payment_hash');
                if (hashSection && hashSection.value.toLowerCase() !== methodDetails.paymentHash.toLowerCase()) {
                    throw new Error('Challenge paymentHash does not match invoice payment hash');
                }
            }
            // Reject invoices whose network does not match the configured network (SHOULD per spec).
            // Only checked when `network` is explicitly configured; skipped otherwise to avoid
            // rejecting valid invoices on networks the caller didn't specify (e.g. regtest demos).
            if (parameters.network) {
                const coinSection = decoded.sections.find((s) => s.name === 'coin_network');
                const BECH32_TO_NETWORK = { bc: 'mainnet', bcrt: 'regtest', tbs: 'signet' };
                const invoiceNetwork = coinSection?.value ? BECH32_TO_NETWORK[coinSection.value.bech32] : undefined;
                if (invoiceNetwork && invoiceNetwork !== parameters.network) {
                    throw new Error(`Invoice network "${invoiceNetwork}" does not match configured network "${parameters.network}"`);
                }
            }
            onProgress?.({ type: 'challenge', invoice, amountSats: parseInt(amount, 10) });
            onProgress?.({ type: 'paying' });
            const result = await wallet.payLightningInvoice({ invoice, maxFeeSats, preferSpark });
            const preimage = await resolvePreimage(wallet, result);
            onProgress?.({ type: 'paid', preimage });
            return Credential.serialize({ challenge, payload: { preimage } });
        },
    });
    /**
     * Closes open Spark websocket connections. Only effective when the SDK owns
     * the wallet (i.e. `mnemonic` was passed rather than `wallet`). Call this
     * when done to allow the process to exit.
     */
    async function cleanup() {
        if (parameters.wallet === undefined && walletPromise) {
            const wallet = await walletPromise;
            await wallet.cleanupConnections();
        }
    }
    return Object.assign(method, { cleanup });
}
