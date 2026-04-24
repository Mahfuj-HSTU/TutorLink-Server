import { betterAuth } from 'better-auth'
import prisma from './prisma.ts'
import { prismaAdapter } from 'better-auth/adapters/prisma'

const appUrls = process.env.APP_URL || 'http://localhost:3000'
const allowedOrigins = appUrls
	.split(',')
	.map((url) => url.trim())
	.filter((url) => url.length > 0)

const isProd =
	process.env.NODE_ENV === 'production' ||
	(process.env.BETTER_AUTH_URL || 'http://localhost:5000').startsWith(
		'https://'
	)

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql'
	}),
	trustedOrigins: allowedOrigins,
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60 // 5 minutes
		}
	},
	advanced: {
		cookiePrefix: 'better-auth',
		useSecureCookies: isProd,
		crossSubDomainCookies: {
			enabled: false
		},
		defaultCookieAttributes: isProd
			? {
					sameSite: 'none',
					secure: true
				}
			: undefined,
		disableCSRFCheck: true // Allow requests without Origin header (Postman, mobile apps, etc.)
	},
	user: {
		additionalFields: {
			role: {
				type: 'string',
				defaultValue: 'STUDENT',
				required: false,
				input: true
			},
			phone: {
				type: 'string',
				required: false,
				input: true
			},
			isBanned: {
				type: 'boolean',
				defaultValue: false,
				required: false,
				input: false
			}
		}
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: false
	}
})
