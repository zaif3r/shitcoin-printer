export type ERC20TemplateArgs = {
    contractName: string;
    name: string;
    symbol: string;
    decimals?: number;
    mintable?: boolean;
    burnable?: boolean;
    preMint?: number;
    maxSupply?: number;
    blacklist?: boolean;
    banner?: string;
    license?: string;
};

export type ERC20TemplateResult = { rendered: string };

