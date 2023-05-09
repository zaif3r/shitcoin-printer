import type { WriteContractMode } from "@wagmi/core";
import type { Abi } from "abitype";

import * as React from "react";

import type { PartialBy } from "@/types/query";
import { deployContract, DeployContractPreparedArgs } from "@/actions/deployContract";
import { useSigner } from "wagmi";
import { Signer } from "ethers";

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
> = UseContractDeployArgs<TMode, TAbi>;

export function useContractDeploy() {
    const [isDeploying, setIsDeploying] = React.useState(false);
    const signer = useSigner();

    async function deploy(config: UseContractDeployConfig) {
        if (!config.abi) throw new Error("abi is required");
        if (!config.bytecode) throw new Error("bytecode is required");
        if (!config.args) throw new Error("args is required");

        switch (config.mode) {
            case "prepared": {
                if (!config.request) throw new Error("request is required");

                setIsDeploying(true);
                try {
                    return await deployContract({
                        mode: "prepared",
                        bytecode: config.bytecode,
                        chainId: config.chainId,
                        abi: config.abi as Abi, // TODO: Remove cast and still support `Narrow<TAbi>`
                        request: config.request,
                        args: config.args,
                        signer: signer.data as Signer,
                    });
                } catch (e) {
                    throw e;
                } finally {
                    setIsDeploying(false);
                }
            }
        }
    }

    return {
        isDeploying,
        deploy,
    };
}
