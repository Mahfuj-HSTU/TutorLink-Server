import { betterAuth } from 'better-auth'
import prisma from './prisma.ts'
import { prismaAdapter } from 'better-auth/adapters/prisma'

const appUrls = process.env.APP_URL || 'http://localhost:3000'
const allowedOrigins = appUrls
	.split(',')
	.map((url) => url.trim())
	.filter((url) => url.length > 0)

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql'
	}),
	trustedOrigins: allowedOrigins,
	user: {
		additionalFields: {
			role: {
				type: 'string',
				defaultValue: 'STUDENT',
				required: false,
				input: true,   // allow client to set role during sign-up
			},
			phone: {
				type: 'string',
				required: false,
				input: true,
			},
			isBanned: {
				type: 'boolean',
				defaultValue: false,
				required: false,
				input: false,  // only admins set this server-side
			},
		}
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: false
	}
})
