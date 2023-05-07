import * as React from "react";
import Link from "next/link";

import { NavItem } from "@/types/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";
import { Icons } from "@/components/icons";

interface MainNavProps {
    items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
    return (
        <div className="flex gap-6 md:gap-10">
            <Link href="/" className="items-center space-x-2 flex">
                <Icons.logo className="min-w-[1.5rem] h-8 w-8" />
                <span className="font-bold inline-block text-lg leading-none">
                    {siteConfig.name}
                </span>
            </Link>
            {items && <nav className="hidden gap-6 md:flex">
                {items.map(
                    (item, index) =>
                        item.href && (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center text-lg font-semibold text-muted-foreground sm:text-sm",
                                    item.disabled && "cursor-not-allowed opacity-80"
                                )}
                            >
                                {item.title}
                            </Link>
                        )
                )}
            </nav>}
        </div>
    );
}
