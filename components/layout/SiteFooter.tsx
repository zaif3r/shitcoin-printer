import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";

export function SiteFooter() {
    return (
        <footer className="dui-footer items-center p-4 bg-primary text-primary-foreground">
            <div className="items-center grid-flow-col pt-6 md:pt-0">
                <Icons.logo className="min-w-[1.5rem] h-4 w-4" />
                <span className="font-semibold inline-block leading-none">
                    {siteConfig.name}
                </span>
            </div>
            <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
                    <div
                        className={buttonVariants({
                            size: "sm",
                            variant: "ghost",
                        })}
                    >
                        <Icons.gitHub className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </div>
                </Link>
                <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
                    <div
                        className={buttonVariants({
                            size: "sm",
                            variant: "ghost",
                        })}
                    >
                        <Icons.twitter className="h-5 w-5 fill-current" />
                        <span className="sr-only">Twitter</span>
                    </div>
                </Link>
            </div>
        </footer>
    );
}
