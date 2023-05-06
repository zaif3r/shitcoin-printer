import type { Abi, Address, Narrow } from "abitype";
import type { BytesLike, PopulatedTransaction } from "ethers";

import { ConnectorNotFoundError, fetchSigner, type Signer } from "@wagmi/core";

import { assertActiveChain } from "@/utils/assertActiveChain";
import { Contract } from "./getContract";
import { getContractFactory } from "./getContractFactory";

export type WriteContractMode = "prepared" | "recklesslyUnprepared";

type Request = PopulatedTransaction & {
    to: Address;
    gasLimit: NonNullable<PopulatedTransaction["gasLimit"]>;
};

export type DeployContractPreparedArgs<TAbi extends Abi | readonly unknown[]> = {
    /**
     * `recklesslyUnprepared`: Allow to pass through unprepared config. Note: This has
     * [UX pitfalls](https://wagmi.sh/react/prepare-hooks#ux-pitfalls-without-prepare-hooks),
     * it is highly recommended to not use this and instead prepare the request upfront
     * using the {@link prepareWriteContract} function.
     *
     * `prepared`: The request has been prepared with parameters required for sending a transaction
     * via the {@link prepareWriteContract} function
     * */
    mode: "prepared";
    /** Chain id to use for provider */
    chainId?: number;
    /** Request to submit transaction for */
    request: Request;

    /** Contract ABI */
    abi: Narrow<TAbi>; // infer `TAbi` type for inline usage
    /** Contract bytecode */
    bytecode: BytesLike;
    args: Array<any>;
};

export type DeployContractArgs<TAbi extends Abi | readonly unknown[]> =
    DeployContractPreparedArgs<TAbi>;

export type DeployContractResult<TAbi extends Abi> = Contract<TAbi>;

/**
 * @description Function to call a contract write method.
 *
 * It is recommended to pair this with the {@link prepareWriteContract} function
 * to avoid [UX pitfalls](https://wagmi.sh/react/prepare-hooks#ux-pitfalls-without-prepare-hooks).
 *
 * @example
 * import { prepareWriteContract, writeContract } from '@wagmi/core'
 *
 * const config = await prepareWriteContract({
 *   address: '0x...',
 *   abi: wagmiAbi,
 *   functionName: 'mint',
 * })
 * const result = await writeContract(config)
 */
export async function deployContract<TAbi extends Abi, TSigner extends Signer = Signer>(
    config: DeployContractPreparedArgs<TAbi>
): Promise<DeployContractResult<TAbi>> {
    /****************************************************************************/
    /** START: iOS App Link cautious code.                                      */
    /** Do not perform any async operations in this block.                      */
    /** Ref: https://wagmi.sh/react/prepare-hooks#ios-app-link-constraints */
    /****************************************************************************/

    const signer = await fetchSigner<TSigner>();
    if (!signer) throw new ConnectorNotFoundError();
    if (config.chainId) assertActiveChain({ chainId: config.chainId, signer });

    const factory = getContractFactory({
        abi: config.abi, // TODO: Remove cast and still support `Narrow<TAbi>`
        bytecode: config.bytecode,
        signer,
    });

    const contract = await factory.deploy(config.args);

    return contract as unknown as Contract<TAbi>;
}
