'use client'

import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth/auth-client'

import { Icons } from '../icons'
import { BetterAuthActionButton } from './better-auth-action-button'

export function ImpersonationIndicator() {
	const router = useRouter()
	const { data: session, refetch } = authClient.useSession()

	if (session?.session.impersonatedBy == null) return null

	return (
		<div className="fixed right-6 bottom-6 z-50">
			<BetterAuthActionButton
				action={() =>
					authClient.admin.stopImpersonating(undefined, {
						onSuccess: () => {
							router.push('/admin/users')
							router.refresh()
							refetch()
						},
					})
				}
				className="rounded-3xl"
				size="icon"
				variant="destructive"
			>
				<Icons.userX className="size-5" />
			</BetterAuthActionButton>
		</div>
	)
}
