import React, { Suspense } from 'react'
import { headers } from 'next/headers'

import ClientOnly from '@/components/client-only'
import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from '@/components/page-header'
import SyncSpinner from '@/components/sync-spinner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	AccountDeletion,
	AccountLinking,
	ChangePasswordForm,
	PasskeyManagement,
	ProfileUpdateForm,
	SessionManagement,
	SetPasswordButton,
	TwoFactorAuth,
} from '@/features/profile/components'
import { auth } from '@/lib/auth/auth'
import { getPageInfo } from '@/lib/constants'

export default async function ProfilePage() {
	const headerList = await headers()
	const session = await auth.api.getSession({ headers: await headers() })

	const pathname = headerList.get('x-current-path')
	const { description, name } = getPageInfo(pathname!)

	if (!session) {
		return null
	}

	return (
		<>
			<PageHeader className="flex-col items-start gap-3">
				<PageHeaderHeading>{name}</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
			</PageHeader>

			<div className="columns-1 gap-x-5 lg:columns-2">
				<div className="break-inside-avoid pb-5" data-label="profile">
					<ProfileUpdateForm user={session.user} />
				</div>

				<div className="break-inside-avoid pb-5" data-label="security">
					<LoadingSuspense>
						<SecurityTab
							email={session.user.email}
							isTwoFactorEnabled={session.user.twoFactorEnabled ?? false}
						/>
					</LoadingSuspense>
				</div>

				<div className="break-inside-avoid pb-5" data-label="sessions">
					<LoadingSuspense>
						<SessionsTab currentSessionToken={session.session.token} />
					</LoadingSuspense>
				</div>

				<div className="break-inside-avoid pb-5" data-label="accounts">
					<LoadingSuspense>
						<LinkedAccountsTab />
					</LoadingSuspense>
				</div>

				<div className="break-inside-avoid pb-5" data-label="danger">
					<AccountDeletion />
				</div>
			</div>
		</>
	)
}

async function LinkedAccountsTab() {
	const accounts = await auth.api.listUserAccounts({
		headers: await headers(),
	})
	const nonCredentialAccounts = accounts.filter(
		(a) => a.providerId !== 'credential'
	)

	return (
		<ClientOnly>
			<AccountLinking currentAccounts={nonCredentialAccounts} />
		</ClientOnly>
	)
}

function LoadingSuspense({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<SyncSpinner className="size-20 animate-spin" />}>
			{children}
		</Suspense>
	)
}

async function SecurityTab({
	email,
	isTwoFactorEnabled,
}: {
	email: string
	isTwoFactorEnabled: boolean
}) {
	const [passkeys, accounts] = await Promise.all([
		auth.api.listPasskeys({ headers: await headers() }),
		auth.api.listUserAccounts({ headers: await headers() }),
	])

	const hasPasswordAccount = accounts.some((a) => a.providerId === 'credential')

	return (
		<div className="space-y-5">
			{hasPasswordAccount ? (
				<ChangePasswordForm />
			) : (
				<SetPasswordButton email={email} />
			)}
			{hasPasswordAccount && (
				<Card>
					<CardHeader className="flex items-center gap-2">
						<CardTitle>Two-Factor Authentication (2FA)</CardTitle>
						{isTwoFactorEnabled && (
							<Badge className="bg-accent text-accent-foreground">
								Enabled
							</Badge>
						)}
					</CardHeader>
					<CardContent>
						<TwoFactorAuth isEnabled={isTwoFactorEnabled} />
					</CardContent>
				</Card>
			)}

			<ClientOnly>
				<PasskeyManagement passkeys={passkeys} />
			</ClientOnly>
		</div>
	)
}

async function SessionsTab({
	currentSessionToken,
}: {
	currentSessionToken: string
}) {
	const sessions = await auth.api.listSessions({ headers: await headers() })

	return (
		<ClientOnly>
			<SessionManagement
				currentSessionToken={currentSessionToken}
				sessions={sessions}
			/>
		</ClientOnly>
	)
}
