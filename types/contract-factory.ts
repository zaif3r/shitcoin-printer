import type { Abi } from "abitype";
import { BytesLike } from "ethers";

export type GetConfig<TAbi extends Abi | readonly unknown[] = Abi> = {
    /** Contract ABI */
    abi: TAbi; // infer `TAbi` type for inline usage
    /** Contract bytecode */
    bytecode: BytesLike;
    args: Array<any>
};