import { ComponentProps, ElementType } from 'react'

import { Icons } from '@/components/icons'

export const SUPPORTED_OAUTH_PROVIDERS = ['google', 'github'] as const
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number]

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
	SupportedOAuthProvider,
	{ Icon: ElementType<ComponentProps<'svg'>>; name: string }
> = {
	github: { Icon: Icons.GitHub, name: 'GitHub' },
	google: { Icon: Icons.Google, name: 'Google' },
}
