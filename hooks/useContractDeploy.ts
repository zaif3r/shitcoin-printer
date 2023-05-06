import type { WriteContractMode } from "@wagmi/core";
import type { Abi } from "abitype";

import * as React from "react";

import type { MutationConfig, PartialBy } from "@/types/query";
import { useMutation } from "@/utils/query/useMutation";
import {
    deployContract,
    DeployContractPreparedArgs,
    DeployContractResult,
} from "@/actions/deployContract";

export type UseContractDeployArgs<
    TMode extends WriteContractMode = WriteContractMode,
    TAbi extends Abi | readonly unknown[] = Abi
> = { mode: TMode } & PartialBy<
    DeployContractPreparedArgs<TAbi>,
    "abi" | "bytecode" | "args"
>;

export type UseContractDeployConfig<
    TMode extends WriteContractMode = WriteContractMode,
    TAbi extends Abi = Abi
> = MutationConfig<
    DeployContractResult<TAbi>,
    Error,
    UseContractDeployArgs<TMode, TAbi>
> &
    UseContractDeployArgs<TMode, TAbi>;

function mutationKey({ bytecode, chainId, abi, ...config }: UseContractDeployArgs) {
    const { request, args } = config as DeployContractPreparedArgs<Abi>;
    return [
        {
            entity: "deployContract",
            bytecode,
            args,
            chainId,
            abi,
            request,
        },
    ] as const;
}

function mutationFn(config: UseContractDeployArgs<WriteContractMode, Abi>) {
    if (!config.abi) throw new Error("abi is required");
    if (!config.bytecode) throw new Error("bytecode is required");
    if (!config.args) throw new Error("args is required");

    switch (config.mode) {
        case "prepared": {
            if (!config.request) throw new Error("request is required");
            return deployContract({
                mode: "prepared",
                bytecode: config.bytecode,
                chainId: config.chainId,
                abi: config.abi as Abi, // TODO: Remove cast and still support `Narrow<TAbi>`
                request: config.request,
                args: config.args,
            });
        }
    }
}

/**
 * @description Hook for calling an ethers Contract [write](https://docs.ethers.io/v5/api/contract/contract/#Contract--write)
 * method.
 *
 * It is highly recommended to pair this with the [`usePrepareContractWrite` hook](/docs/prepare-hooks/usePrepareContractWrite)
 * to [avoid UX pitfalls](https://wagmi.sh/react/prepare-hooks#ux-pitfalls-without-prepare-hooks).
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
export function useContractDeploy<TMode extends WriteContractMode, TAbi extends Abi>(
    config: UseContractDeployConfig<TMode, TAbi> = {} as any
) {
    const { abi, bytecode, chainId, mode, args, request } = config;
    const {
        data,
        error,
        isError,
        isIdle,
        isLoading,
        isSuccess,
        mutate,
        mutateAsync,
        reset,
        status,
        variables,
    } = useMutation(
        mutationKey({
            abi: abi as Abi,
            bytecode,
            chainId,
            mode,
            args: args as unknown[],
            request,
        }),
        mutationFn,
        {
            onError: config.onError as UseContractDeployConfig["onError"],
            onMutate: config.onMutate as UseContractDeployConfig["onMutate"],
            onSettled: config.onSettled as UseContractDeployConfig["onSettled"],
            onSuccess: config.onSuccess as UseContractDeployConfig["onSuccess"],
        }
    );

    const write = React.useMemo(() => {
        if (mode === "prepared") {
            if (!request) return undefined;
            return () =>
                mutate({
                    chainId,
                    abi: abi as Abi,
                    bytecode,
                    mode: "prepared",
                    request,
                    args,
                });
        }
        return undefined;
    }, [chainId, abi, bytecode, mode, mutate, request, args]) as MutationFn<
        typeof mode,
        TAbi
    >;

    const writeAsync = React.useMemo(() => {
        if (mode === "prepared") {
            if (!request) return undefined;
            return () =>
                mutateAsync({
                    chainId,
                    abi: abi as Abi,
                    bytecode,
                    mode: "prepared",
                    request,
                    args,
                });
        }
    }, [chainId, abi, bytecode, mode, mutateAsync, args, request]) as MutationFn<
        typeof mode,
        TAbi
    >;

    return {
        data,
        error,
        isError,
        isIdle,
        isLoading,
        isSuccess,
        reset,
        status,
        variables,
        write,
        writeAsync,
    };
}

type MutationFn<TMode extends WriteContractMode, TReturnType> = TMode extends "prepared"
    ? (() => TReturnType) | undefined
    : never;
