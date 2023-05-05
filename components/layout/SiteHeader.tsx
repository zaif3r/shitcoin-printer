import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/layout/MainNav"

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <div className="hidden md:block">
					    <ConnectButton />
            </div>
            <div className="md:hidden">
					    <ConnectButton accountStatus={"avatar"}/>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}