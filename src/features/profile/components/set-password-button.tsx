'use client'

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { authClient } from '@/lib/auth/auth-client'

export function SetPasswordButton({ email }: { email: string }) {
	return (
		<Card className="gap-0">
			<CardHeader className="mb-4">
				<CardTitle>Set Password</CardTitle>
				<CardDescription>
					We will send you a password reset email to set up a password.
				</CardDescription>
			</CardHeader>
			<CardFooter className="border-t">
				<BetterAuthActionButton
					action={() => {
						return authClient.requestPasswordReset({
							email,
							redirectTo: '/change-password',
						})
					}}
					size="sm"
					successMessage="Password reset email sent"
					variant="outline"
				>
					Send Password Reset Email
				</BetterAuthActionButton>
			</CardFooter>
		</Card>
	)
}
