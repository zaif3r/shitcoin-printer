import { siteConfig } from "@/config/site"

export const ironOptions = {
	cookieName: siteConfig.name,
	password: process.env.SESSION_PASSWORD ?? "set_a_complex_password_at_least_32_characters_long",
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
	},
};