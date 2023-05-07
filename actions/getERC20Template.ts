import { ERC20TemplateArgs } from "@/types/templates";

export async function getERC20Template(
    data: ERC20TemplateArgs
): Promise<{ rendered: string }> {
    const response = await fetch("/api/templates/erc20", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Error rendering ERC20 template");
    } else {
        const rendered = await response.json();
        return rendered;
    }
}
