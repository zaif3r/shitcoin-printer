import type { Abi, Narrow } from "abitype";
import type { BytesLike, PopulatedTransaction } from "ethers";

import { ConnectorNotFoundError, fetchSigner, type Signer } from "@wagmi/core";
import type { GetConfig } from "@/types/contract-factory";
import { assertActiveChain } from "@/utils/assertActiveChain";
import { getContractFactory } from "./getContractFactory";

export type PrepareDeployContractConfig<
    TAbi extends Abi | readonly unknown[] = Abi,
    TChainId extends number = number,
    TSigner extends Signer = Signer
> = GetConfig<TAbi> & {
    /** Chain id to use for provider */
    chainId?: TChainId | number;
    /** Custom signer */
    signer?: TSigner | null;
};

export type Request = PopulatedTransaction & {
    gasLimit: NonNullable<PopulatedTransaction["gasLimit"]>;
};

export type PrepareDeployContractResult<
    TAbi extends Abi | readonly unknown[] = Abi,
    TChainId extends number = number
> = {
    abi: Narrow<TAbi>;
    bytecode: BytesLike;
    chainId?: TChainId;
    mode: "prepared";
    args: Array<any>;
    request: Request;
};

/**
 * @description Prepares the parameters required for a contract write transaction.
 *
 * Returns config to be passed through to `writeContract`.
 *
 * @example
 * import { prepareWriteContract, writeContract } from '@wagmi/core'
 *
 * const config = await prepareWriteContract({
 *  address: '0x...',
 *  abi: wagmiAbi,
 *  functionName: 'mint',
 * })
 * const result = await writeContract(config)
 */
export async function prepareDeployContract<
    TAbi extends Abi | readonly unknown[],
    TChainId extends number,
    TSigner extends Signer = Signer
>({
    abi,
    chainId,
    signer: signer_,
    bytecode,
    ...config
}: PrepareDeployContractConfig<TAbi, TChainId, TSigner>): Promise<
    PrepareDeployContractResult<TAbi, TChainId>
> {
    const signer = signer_ ?? (await fetchSigner({ chainId }));
    if (!signer) throw new ConnectorNotFoundError();
    if (chainId) assertActiveChain({ chainId, signer });

    const factory = getContractFactory({
        abi: abi as Abi, // TODO: Remove cast and still support `Narrow<TAbi>`
        bytecode,
        signer,
    });
    const args = config.args as unknown[];

    const request = factory.getDeployTransaction(...args);

    const unsignedTransaction = (await signer.populateTransaction(
        request
    )) as PopulatedTransaction;
    const gasLimit =
        unsignedTransaction.gasLimit || (await signer.estimateGas(unsignedTransaction));

    return {
        args,
        bytecode,
        abi: abi as any,
        chainId: chainId as TChainId,
        mode: "prepared",
        request: {
            ...unsignedTransaction,
            gasLimit,
        },
    } as const;
}
