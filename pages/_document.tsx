import { Html, Head, Main, NextScript } from 'next/document';

import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/utils/fonts"
import { cn } from "@/utils/cn"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { ThemeProvider } from "@/components/layout/ThemeProvider"

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	icons: {
	  icon: "/favicon.ico",
	  shortcut: "/favicon-16x16.png",
	  apple: "/apple-touch-icon.png",
	},
}

export default function Document() {
	return (
		<Html lang='en' suppressHydrationWarning>
			<Head>
				{/* Character Set */}
				<meta charSet='utf-8' />

				<meta name='description' content={siteConfig.description} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />

				{/* Favicon */}
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='/favicon/apple-touch-icon.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='/favicon/favicon-32x32.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='/favicon/favicon-16x16.png'
				/>
				<link rel='manifest' href='/favicon/site.webmanifest' />

				{/* Robots Search Indexing */}
				<meta
					name='robots'
					content='follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large'
				/>
			</Head>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
			 	)}
			>
				 <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<div className="relative flex min-h-screen flex-col">
						<SiteHeader />
						<div className="flex-1">
							<Main />
							<NextScript />	
						</div>
					</div>
				</ThemeProvider>
			</body>
		</Html>
	);
}
