import type { AppProps } from 'next/app';
import Web3Provider from '@/providers/Web3';
import { SEO } from '@/components/layout';
import { SiteHeader } from "@/components/layout/SiteHeader"
import { ThemeProvider } from "@/components/layout/ThemeProvider"

import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Web3Provider>
			<SEO />
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<div className="relative flex min-h-screen flex-col">
					<SiteHeader />
					<div className="flex-1">
						<Component {...pageProps} />
					</div>
				</div>
			</ThemeProvider>
		</Web3Provider>
	);
}
