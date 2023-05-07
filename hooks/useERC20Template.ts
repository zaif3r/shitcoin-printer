import type { QueryConfig, QueryFunctionArgs } from "@/types/query";

import { useQuery } from "wagmi";
import { ERC20TemplateArgs, ERC20TemplateResult } from "@/types/templates";
import { getERC20Template } from "@/actions/getERC20Template";

export type UseERC20TemplateConfig = Omit<
    QueryConfig<ERC20TemplateResult, Error>,
    "cacheTime" | "staleTime" | "enabled"
> &
    ERC20TemplateArgs;

export function queryKey({
    contractName,
    name,
    symbol,
    decimals,
    mintable,
    burnable,
    preMint,
    maxSupply,
    license,
    banner,
}: ERC20TemplateArgs) {
    return [
        {
            entity: "erc20template",
            contractName,
            name,
            symbol,
            decimals,
            mintable,
            burnable,
            preMint,
            maxSupply,
            license,
            banner,
            persist: false,
        },
    ] as const;
}

function queryFn({ queryKey: [args] }: QueryFunctionArgs<typeof queryKey>) {
    return getERC20Template(args);
}

export function useERC20Template(
    {
        contractName,
        name,
        symbol,
        suspense,
        onError,
        onSettled,
        onSuccess,
        ...config
    }: UseERC20TemplateConfig = {} as any
) {
    const erc20TemplateQuery = useQuery<
        ERC20TemplateResult,
        Error,
        ERC20TemplateResult,
        ReturnType<typeof queryKey>
    >(queryKey({ contractName, name, symbol, ...config }), queryFn, {
        cacheTime: 0,
        /* enabled: Boolean(connector), */
        staleTime: Infinity,
        suspense,
        onError,
        onSettled,
        onSuccess,
    });

    return erc20TemplateQuery;
}
