'use client'

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/auth/auth-client'

export function AccountDeletion() {
	return (
		<Card className="gap-0 border">
			<CardHeader>
				<CardTitle>Delete your account</CardTitle>
				<CardAction>
					<BetterAuthActionButton
						action={() => authClient.deleteUser({ callbackURL: '/sign-in' })}
						className="bg-destructive/20 text-destructive not-disabled:hover:bg-destructive/25"
						requireAreYouSure
						size="sm"
						successMessage="Account deletion initiated. Please check your email to confirm."
					>
						Delete Account
					</BetterAuthActionButton>
				</CardAction>
			</CardHeader>
		</Card>
	)
}
