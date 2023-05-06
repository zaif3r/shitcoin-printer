import type { FetchSignerResult, Signer } from "@wagmi/core";
import type { Abi } from "abitype";
import type { providers } from "ethers";

import type { PartialBy, QueryConfig, QueryFunctionArgs } from "@/types/query";
import { useNetwork, useSigner } from "wagmi";
import { useQuery } from "@/utils/query/useQuery";
import {
    type PrepareDeployContractConfig,
    type PrepareDeployContractResult,
    prepareDeployContract,
} from "@/actions/prepareDeployContract";

export type UsePrepareContractDeployConfig<
    TAbi extends Abi | readonly unknown[] = Abi,
    TChainId extends number = number,
    TSigner extends Signer = Signer
> = PartialBy<
    PrepareDeployContractConfig<TAbi, TChainId, TSigner>,
    "abi" | "bytecode" | "args"
> &
    QueryConfig<PrepareDeployContractResult<TAbi, TChainId>, Error>;

type QueryKeyArgs = Omit<PrepareDeployContractConfig, "abi">;
type QueryKeyConfig = Pick<UsePrepareContractDeployConfig, "scopeKey"> & {
    activeChainId?: number;
    signerAddress?: string;
};

function queryKey({
    activeChainId,
    args,
    bytecode,
    chainId,
    signerAddress,
}: QueryKeyArgs & QueryKeyConfig) {
    return [
        {
            entity: "prepareContractDeployment",
            activeChainId,
            args,
            chainId,
            bytecode,
            signerAddress,
        },
    ] as const;
}

function queryFn({
    abi,
    signer,
}: {
    abi?: Abi | readonly unknown[];
    signer?: FetchSignerResult;
}) {
    return ({
        queryKey: [{ args, bytecode, chainId }],
    }: QueryFunctionArgs<typeof queryKey>) => {
        if (!abi) throw new Error("abi is required");
        if (!bytecode) throw new Error("bytecode is required");

        return prepareDeployContract({
            // TODO: Remove cast and still support `Narrow<TAbi>`
            abi: abi as Abi,
            args,
            bytecode,
            chainId,
            signer,
        });
    };
}

/**
 * @description Hook for preparing a contract write to be sent via [`useContractWrite`](/docs/hooks/useContractWrite).
 *
 * Eagerly fetches the parameters required for sending a contract write transaction such as the gas estimate.
 *
 * @example
 * import { useContractWrite, usePrepareContractWrite } from 'wagmi'
 *
 * const { config } = usePrepareContractWrite({
 *  address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
 *  abi: wagmigotchiABI,
 *  functionName: 'feed',
 * })
 * const { data, isLoading, isSuccess, write } = useContractWrite(config)
 *
 */
export function usePrepareContractDeploy<
    TAbi extends Abi | readonly unknown[],
    TChainId extends number
>(
    {
        abi,
        bytecode,
        chainId,
        args,
        cacheTime,
        enabled = true,
        scopeKey,
        staleTime,
        suspense,
        onError,
        onSettled,
        onSuccess,
    }: UsePrepareContractDeployConfig<TAbi, TChainId> = {} as any
) {
    const { chain: activeChain } = useNetwork();
    const { data: signer } = useSigner<providers.JsonRpcSigner>({ chainId });

    const prepareContractDeployQuery = useQuery(
        queryKey({
            activeChainId: activeChain?.id,
            args,
            chainId,
            bytecode,
            scopeKey,
            signerAddress: signer?._address,
        } as Omit<PrepareDeployContractConfig, "abi">),
        queryFn({
            // TODO: Remove cast and still support `Narrow<TAbi>`
            abi: abi as Abi,
            signer,
        }),
        {
            cacheTime,
            enabled: Boolean(enabled && abi && bytecode && signer),
            staleTime,
            suspense,
            onError,
            onSettled,
            onSuccess,
        }
    );

    return Object.assign(prepareContractDeployQuery, {
        config: {
            abi,
            bytecode,
            args,
            chainId,
            mode: "prepared",
            request: undefined,
            ...prepareContractDeployQuery.data,
        } as unknown as PrepareDeployContractResult<TAbi, TChainId>,
    });
}
