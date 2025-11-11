'use client'

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth/auth-client'
import {
	SUPPORTED_OAUTH_PROVIDER_DETAILS,
	SUPPORTED_OAUTH_PROVIDERS,
} from '@/lib/auth/o-auth-providers'

export function SocialAuthButtons() {
	return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
		const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon

		return (
			<BetterAuthActionButton
				action={() => {
					return authClient.signIn.social({
						callbackURL: '/',
						provider,
					})
				}}
				key={provider}
				size="lg"
				variant="outline"
			>
				<Icon className="size-4.5" />
				{SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
			</BetterAuthActionButton>
		)
	})
}
