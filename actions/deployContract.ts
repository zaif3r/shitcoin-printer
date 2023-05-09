import type { Abi } from "abitype";
import type { BytesLike, PopulatedTransaction } from "ethers";

import { ConnectorNotFoundError, type Signer } from "@wagmi/core";

import { assertActiveChain } from "@/utils/assertActiveChain";
import { Contract } from "./getContract";
import { getContractFactory } from "./getContractFactory";

export type WriteContractMode = "prepared" | "recklesslyUnprepared";

type Request = PopulatedTransaction & {
    to: string;
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
    abi: TAbi; // infer `TAbi` type for inline usage
    /** Contract bytecode */
    bytecode: BytesLike;
    args: Array<any>;
    signer?: Signer
};

export type DeployContractArgs<TAbi extends Abi | readonly unknown[]> =
    DeployContractPreparedArgs<TAbi>;

export type DeployContractResult<TAbi extends Abi> = Contract<TAbi>;

export async function deployContract<TAbi extends Abi>(
    config: DeployContractPreparedArgs<TAbi>
): Promise<DeployContractResult<TAbi>> {
    /****************************************************************************/
    /** START: iOS App Link cautious code.                                      */
    /** Do not perform any async operations in this block.                      */
    /** Ref: https://wagmi.sh/react/prepare-hooks#ios-app-link-constraints */
    /****************************************************************************/

    if (!config.signer) throw new ConnectorNotFoundError();
    if (config.chainId) assertActiveChain({ chainId: config.chainId, signer: config.signer });

    const factory = getContractFactory({
        abi: config.abi, // TODO: Remove cast and still support `Narrow<TAbi>`
        bytecode: config.bytecode,
        signer: config.signer,
    });

    const contract = await factory.deploy(config.args);

    return contract as unknown as Contract<TAbi>;
}
