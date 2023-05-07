import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { ironOptions } from "@/config/iron-session";
import Handlebars from "handlebars";
import * as fs from "fs";
import path from "path";

import type { ERC20TemplateArgs } from "@/types/templates";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    switch (method) {
        case "POST":
            try {
                const contractsDir = path.resolve(process.cwd(), "contracts");
                const data: ERC20TemplateArgs = JSON.parse(req.body);
                const file = fs.readFileSync(
                    path.join(contractsDir, "ERC20Template.hbs"),
                    "utf8"
                );
                const template = Handlebars.compile(file);
                const rendered = template(data);
                res.json({ rendered });
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
