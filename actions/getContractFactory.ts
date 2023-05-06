import type { Abi, Address, Narrow } from "abitype";
import type { ContractInterface, Signer, ethers, BytesLike } from "ethers";
import type { TransactionRequest } from "@ethersproject/abstract-provider";
import { ContractFactory as EthersContractFactory } from "ethers";

import type {
    BaseInterface,
    Contract,
    InterfaceEvents,
    InterfaceFunctions,
} from "./getContract";

export type GetContractFactoryArgs<TAbi extends Abi | readonly unknown[] = Abi> = {
    /** Contract ABI */
    abi: Narrow<TAbi>;
    /** Contract bytecode */
    bytecode: BytesLike;
    /** Signer or provider to attach to contract */
    signer?: Signer;
};

export type GetContractFactoryResult<TAbi = unknown> = TAbi extends Abi
    ? ContractFactory<TAbi> & EthersContractFactory
    : EthersContractFactory;

export function getContractFactory<TAbi extends Abi | readonly unknown[]>({
    abi,
    bytecode,
    signer,
}: GetContractFactoryArgs<TAbi>): GetContractFactoryResult<TAbi> {
    return new EthersContractFactory(
        abi as unknown as ContractInterface,
        bytecode,
        signer
    ) as GetContractFactoryResult<TAbi>;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Contract factory

// TODO: Add remaining properties
type PropertyKeys = "attach" | "connect" | "interface";
type FunctionKeys = "getDeployTransaction" | "deploy";

// Create new `BaseContract` and remove keys we are going to type
type BaseContractFactory<
    TContractfactory extends Record<
        keyof Pick<EthersContractFactory, PropertyKeys | FunctionKeys>,
        unknown
    >
> = Omit<EthersContractFactory, PropertyKeys | FunctionKeys> & TContractfactory;

export type ContractFactory<TAbi extends Abi> = BaseContractFactory<{
    attach(addressOrName: Address | string): Contract<TAbi>;
    connect(
        signerOrProvider: ethers.Signer | ethers.providers.Provider | string
    ): Contract<TAbi>;
    interface: BaseInterface<{
        events: InterfaceEvents<TAbi>;
        functions: InterfaceFunctions<TAbi>;
    }>;

    getDeployTransaction(...args: Array<any>): TransactionRequest;
    deploy(...args: Array<any>): Promise<Contract<TAbi>>;
}>;
