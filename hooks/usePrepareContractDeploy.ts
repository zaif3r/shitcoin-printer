import type { Abi } from "abitype";
import { useState } from "react";

import {
    type PrepareDeployContractConfig,
    prepareDeployContract,
} from "@/actions/prepareDeployContract";

import type { PartialBy } from "@/types/query";
import { DeployContractPreparedArgs } from "@/actions/deployContract";
import { ContractData } from "@/types/solc";
import { useSigner } from "wagmi";

export type UseContractDeployArgs = PartialBy<
    DeployContractPreparedArgs<Abi>,
    "abi" | "bytecode" | "request"
>;

export type UsePrepareContractDeployConfig = PartialBy<
    PrepareDeployContractConfig,
    "abi" | "bytecode"
>;

export function usePrepareContractDeploy(
    { chainId, args }: UsePrepareContractDeployConfig = {} as any
) {
    const [isLoading, setIsLoading] = useState(false);
    const signer = useSigner({ chainId });

    function prepareContractDeploy(contractData: ContractData) {
        if (!contractData.abi) throw new Error("abi is required");
        if (!contractData.bytecode) throw new Error("bytecode is required");

        try {
            setIsLoading(true);
            return prepareDeployContract({
                abi: contractData.abi,
                args,
                bytecode: contractData.bytecode,
                chainId,
                signer: signer.data,
            });
        } catch (e) {
            throw e;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        prepareContractDeploy,
    };
}
