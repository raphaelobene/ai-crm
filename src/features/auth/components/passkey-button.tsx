'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth/auth-client'

export function PasskeyButton() {
	const router = useRouter()
	const { refetch } = authClient.useSession()

	useEffect(() => {
		authClient.signIn.passkey(
			{ autoFill: true },
			{
				onSuccess() {
					refetch()
					router.push('/')
				},
			}
		)
	}, [router, refetch])

	return (
		<BetterAuthActionButton
			action={() =>
				authClient.signIn.passkey(undefined, {
					onSuccess() {
						refetch()
						router.push('/')
					},
				})
			}
			variant="outline"
			size="sm"
		>
			Use Passkey
		</BetterAuthActionButton>
	)
}
