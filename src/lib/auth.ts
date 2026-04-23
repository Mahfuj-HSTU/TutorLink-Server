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
	(process.env.BETTER_AUTH_URL || 'http://localhost:5000').startsWith('https://')

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  trustedOrigins: allowedOrigins,
  advanced: {
    useSecureCookies: isProd,
    ...(isProd && {
      cookies: {
        session_token: { attributes: { sameSite: 'none', secure: true } },
        session_data: { attributes: { sameSite: 'none', secure: true } }
      }
    })
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
