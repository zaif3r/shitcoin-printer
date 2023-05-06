import { siteConfig } from "@/config/site"

export const ironOptions = {
	cookieName: siteConfig.name,
	password: process.env.SESSION_PASSWORD!!,
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
	},
};