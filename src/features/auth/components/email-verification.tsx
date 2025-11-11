'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth/auth-client'

export function EmailVerification() {
	const searchParams = useSearchParams()
	const [timeToNextResend, setTimeToNextResend] = useState(30)
	const interval = useRef<NodeJS.Timeout>(undefined)

	const email = searchParams.get('email')

	useEffect(() => {
		startEmailVerificationCountdown()
	}, [])

	function startEmailVerificationCountdown(time = 30) {
		setTimeToNextResend(time)

		clearInterval(interval.current)
		interval.current = setInterval(() => {
			setTimeToNextResend((t) => {
				const newT = t - 1

				if (newT <= 0) {
					clearInterval(interval.current)
					return 0
				}
				return newT
			})
		}, 1000)
	}

	return (
		<div className="w-full text-center">
			<BetterAuthActionButton
				action={() => {
					if (!email) {
						return Promise.reject(new Error('Email not provided'))
					}
					startEmailVerificationCountdown()
					return authClient.sendVerificationEmail({
						callbackURL: '/',
						email,
					})
				}}
				className="max-w-40"
				disabled={timeToNextResend > 0}
				size="sm"
				successMessage="Verification email sent!"
				variant="outline"
			>
				{timeToNextResend > 0
					? `Resend Email (${timeToNextResend})`
					: 'Resend Email'}
			</BetterAuthActionButton>
		</div>
	)
}
