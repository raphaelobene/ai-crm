import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { createAuthMiddleware } from 'better-auth/api'
import { nextCookies } from 'better-auth/next-js'
import { admin as adminPlugin } from 'better-auth/plugins/admin'
import { passkey } from 'better-auth/plugins/passkey'
import { twoFactor } from 'better-auth/plugins/two-factor'

import { PrismaClient } from '@/generated/prisma/client'

import { site } from '../constants'
import { sendDeleteAccountVerificationEmail } from '../emails/delete-account-verification'
import { sendEmailVerification } from '../emails/send-email-verification'
import { sendPasswordResetEmail } from '../emails/send-password-reset-email'
import { sendWelcomeEmail } from '../emails/welcome-email'
import {
	ac,
	admin,
	marketingManager,
	marketingRep,
	salesManager,
	salesRep,
	superAdmin,
	supportManager,
	supportRep,
	user,
} from './permissions'

const prisma = new PrismaClient()
export const auth = betterAuth({
	appName: site.name,
	database: prismaAdapter(prisma, {
		provider: 'mongodb',
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ url, user }) => {
			await sendPasswordResetEmail({ url, user })
		},
	},
	emailVerification: {
		autoSignInAfterVerification: true,
		sendOnSignUp: true,
		sendVerificationEmail: async ({ url, user }) => {
			await sendEmailVerification({ url, user })
		},
	},
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path.startsWith('/sign-up')) {
				const user = ctx.context.newSession?.user ?? {
					email: ctx.body.email,
					name: ctx.body.name,
				}

				if (user !== null) {
					await sendWelcomeEmail(user)
				}
			}
		}),
	},
	plugins: [
		twoFactor(),
		passkey(),
		adminPlugin({
			ac,
			roles: {
				superAdmin,
				admin,
				salesManager,
				salesRep,
				marketingManager,
				marketingRep,
				supportManager,
				supportRep,
				user,
			},
		}),
		nextCookies(),
	],
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60, // 1 minute
		},
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	user: {
		additionalFields: {},
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async ({ newEmail, url, user }) => {
				await sendEmailVerification({
					url,
					user: { ...user, email: newEmail },
				})
			},
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ url, user }) => {
				await sendDeleteAccountVerificationEmail({ url, user })
			},
		},
	},
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
