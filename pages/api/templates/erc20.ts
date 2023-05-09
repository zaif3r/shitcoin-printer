import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { ironOptions } from "@/config/iron-session";
import Handlebars from "handlebars";
import * as fs from "fs";
import path from "path";

import type { ERC20TemplateArgs } from "@/types/templates";

const contractsDir = path.resolve(process.cwd(), "contracts");

const templateFile = fs.readFileSync(
    path.join(contractsDir, "ERC20Template.hbs"),
    "utf8"
);

const sourceCodeFile = fs.readFileSync(
    path.join(contractsDir, "ERC20TemplateFlatten.hbs"),
    "utf8"
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    switch (method) {
        case "POST":
            try {
                const body: ERC20TemplateArgs = JSON.parse(req.body);
                const decimals = body.decimals ? body.decimals : 18;
                const data = {
                    ...body,
                    preMint: body.preMint ? body.preMint * 10 ** decimals : undefined,
                    maxSupply: body.maxSupply
                        ? body.maxSupply * 10 ** decimals
                        : undefined,
                };
                const template = Handlebars.compile(templateFile);
                const sourceCode = Handlebars.compile(sourceCodeFile);
                const renderedTemplate = template(data);
                const renderedSourceCode = sourceCode(data);
                res.json({ template: renderedTemplate, sourceCode: renderedSourceCode });
            } catch (_error) {
                console.log(_error);
                res.status(400).end("error rendering erc20 template");
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default withIronSessionApiRoute(handler, ironOptions);
