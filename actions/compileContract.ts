import { ContractData } from "@/types/solc";

export const compile = (contractCode: string): Promise<ContractData[]> => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            new URL("../workers/solc.ts", import.meta.url), { type: "module" }
        );
        worker.onmessage = function (e: any) {
            const output = e.data.output;
            const result = [];
            if (!output.contracts) {
                reject("Invalid source code");
                return;
            }
            for (const contractName in output.contracts['contract']) {
                const contract = output.contracts['contract'][contractName];
                result.push({
                    contractName: contractName,
                    bytecode: contract.evm.bytecode.object,
                    abi: contract.abi
                } as ContractData);
            }
            resolve(result);
        };
        worker.onerror = reject;
        worker.postMessage({
            contractCode: contractCode,
        });
    });
};