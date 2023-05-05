import React from 'react';
import { siteConfig } from '@/config/site'
import { DefaultSeo } from 'next-seo';

const SEO = () => {
	const origin =
		typeof window !== 'undefined' && window.location.origin
			? window.location.origin
			: siteConfig.url;

	return (
		<DefaultSeo
			title={siteConfig.name}
			defaultTitle={siteConfig.name}
			titleTemplate={`%s | ${siteConfig.name}`}
			description={siteConfig.description}
			defaultOpenGraphImageWidth={1200}
			defaultOpenGraphImageHeight={630}
			openGraph={{
				type: 'website',
				siteName: siteConfig.name,
				url: origin,
				images: [
					{
						url: `${origin}/og.png`,
						alt: `${siteConfig.name} Open Graph Image`,
					},
				],
			}}
			twitter={{
				handle: `@${siteConfig.social.twitter}`,
				site: `@${siteConfig.social.twitter}`,
				cardType: 'summary_large_image',
			}}
		/>
	);
};

export default SEO;
