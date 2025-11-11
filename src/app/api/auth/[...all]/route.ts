import { findIp } from '@arcjet/ip'
import arcjet, {
	BotOptions,
	detectBot,
	EmailOptions,
	protectSignup,
	shield,
	slidingWindow,
	SlidingWindowRateLimitOptions,
} from '@arcjet/next'
import { toNextJsHandler } from 'better-auth/next-js'

import { auth } from '@/lib/auth/auth'

const aj = arcjet({
	characteristics: ['userIdOrIp'],
	key: process.env.ARCJET_API_KEY!,
	rules: [shield({ mode: 'LIVE' })],
})

const botSettings = {
	allow: ['STRIPE_WEBHOOK'],
	mode: 'LIVE',
} satisfies BotOptions
const restrictiveRateLimitSettings = {
	interval: '10m',
	max: 10,
	mode: 'LIVE',
} satisfies SlidingWindowRateLimitOptions<[]>
const laxRateLimitSettings = {
	interval: '1m',
	max: 60,
	mode: 'LIVE',
} satisfies SlidingWindowRateLimitOptions<[]>
const emailSettings = {
	block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
	mode: 'LIVE',
} satisfies EmailOptions

const authHandlers = toNextJsHandler(auth)
export const { GET } = authHandlers

export async function POST(request: Request) {
	const clonedRequest = request.clone()
	const decision = await checkArcjet(request)

	if (decision.isDenied()) {
		if (decision.reason.isRateLimit()) {
			return new Response(null, { status: 429 })
		} else if (decision.reason.isEmail()) {
			let message: string

			if (decision.reason.emailTypes.includes('INVALID')) {
				message = 'Email address format is invalid.'
			} else if (decision.reason.emailTypes.includes('DISPOSABLE')) {
				message = 'Disposable email addresses are not allowed.'
			} else if (decision.reason.emailTypes.includes('NO_MX_RECORDS')) {
				message = 'Email domain is not valid.'
			} else {
				message = 'Invalid email.'
			}

			return Response.json({ message }, { status: 400 })
		} else {
			return new Response(null, { status: 403 })
		}
	}

	return authHandlers.POST(clonedRequest)
}

async function checkArcjet(request: Request) {
	const body = (await request.json()) as unknown
	const session = await auth.api.getSession({ headers: request.headers })
	const userIdOrIp = (session?.user.id ?? findIp(request)) || '127.0.0.1'

	if (request.url.endsWith('/auth/sign-up')) {
		if (
			body &&
			typeof body === 'object' &&
			'email' in body &&
			typeof body.email === 'string'
		) {
			return aj
				.withRule(
					protectSignup({
						bots: botSettings,
						email: emailSettings,
						rateLimit: restrictiveRateLimitSettings,
					})
				)
				.protect(request, { email: body.email, userIdOrIp })
		} else {
			return aj
				.withRule(detectBot(botSettings))
				.withRule(slidingWindow(restrictiveRateLimitSettings))
				.protect(request, { userIdOrIp })
		}
	}

	return aj
		.withRule(detectBot(botSettings))
		.withRule(slidingWindow(laxRateLimitSettings))
		.protect(request, { userIdOrIp })
}
