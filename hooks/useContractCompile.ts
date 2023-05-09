import { useState } from "react";
import { compile } from "@/actions/compileContract";

export type UseContractCompileArgs = {
    contractName: string;
    sourceCode?: string;
};

export type UseContractCompileResult = unknown;

export type UseContractCompileConfig = UseContractCompileArgs;

export function useContractCompile(config: UseContractCompileConfig = {} as any) {
    const [isCompiling, setIsCompiling] = useState(false);

    const compileSourceCode = async () => {
        if (!config.sourceCode) {
            throw new Error("sourceCode is required");
        }
        setIsCompiling(true);
        try {
            const contractData = await compile(config.sourceCode);
            const data = contractData.find(
                (c) => c.contractName == config.contractName
            )!!;
            return data;
        } catch (err) {
            throw err;
        } finally {
            setIsCompiling(false);
        }
    };

    return {
        isCompiling,
        compileSourceCode,
    };
}
