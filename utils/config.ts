import { mainnet, polygon, sepolia, polygonMumbai } from 'wagmi/chains';
import { siteConfig } from "@/config/site"

export const ETH_CHAINS = [mainnet, polygon, sepolia, polygonMumbai];
export const WALLET_CONNECT_PROJECT_ID = 'YOUR_WALLET_CONNECT_PROJECT_ID';

export const SOCIAL_TWITTER = 'Envoy_1084';
export const SOCIAL_GITHUB = 'Envoy-VC/boilr3';

export const ironOptions = {
	cookieName: siteConfig.name,
	password: process.env.SESSION_PASSWORD!!,
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
	},
};
