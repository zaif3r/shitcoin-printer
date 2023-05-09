import type { Abi } from "abitype";
import { BytesLike } from "ethers";

export interface ContractData {
    contractName: string;
    bytecode: BytesLike;
    abi: Abi;
}
