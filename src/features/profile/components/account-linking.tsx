'use client'

import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { DataTable } from '@/components/data-table'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { auth } from '@/lib/auth/auth'
import { authClient } from '@/lib/auth/auth-client'
import {
	SUPPORTED_OAUTH_PROVIDER_DETAILS,
	SUPPORTED_OAUTH_PROVIDERS,
	SupportedOAuthProvider,
} from '@/lib/auth/o-auth-providers'

import { getAccountColumns } from './getAccountColumns'

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number]

export function AccountLinking({
	currentAccounts,
}: {
	currentAccounts: Account[]
}) {
	const router = useRouter()

	const linkAccount = useCallback((provider: string) => {
		return authClient.linkSocial({
			callbackURL: '/admin/settings',
			provider,
		})
	}, [])

	const unlinkAccount = useCallback(
		(account: Account) => {
			if (account == null) {
				return Promise.resolve({ error: { message: 'Account not found' } })
			}
			return authClient.unlinkAccount(
				{
					accountId: account.accountId,
					providerId: account.providerId,
				},
				{
					onSuccess: () => {
						router.refresh()
					},
				}
			)
		},
		[router]
	)

	const columns = useMemo(
		() =>
			getAccountColumns({
				unlinkAccount,
			}),
		[unlinkAccount]
	)

	return (
		<Card className="gap-0">
			<CardHeader className="mb-4">
				<CardTitle>Linked Accounts</CardTitle>
				<CardDescription>
					Link your account to third-party authentication providers.
				</CardDescription>
			</CardHeader>

			{currentAccounts.length > 0 && (
				<CardContent className="px-0">
					<div className="relative w-full overflow-x-auto overflow-y-hidden">
						<DataTable
							data={currentAccounts}
							columns={columns}
							noResultPlaceholder="No linked account"
						/>
					</div>
				</CardContent>
			)}

			<CardFooter className="gap-3 border-t">
				{SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
					const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[
						provider as SupportedOAuthProvider
					] ?? {
						name: provider,
					}

					const isLinked = currentAccounts.some(
						(account) => account.providerId === provider
					)

					return (
						<BetterAuthActionButton
							action={() => linkAccount(provider)}
							disabled={isLinked}
							key={provider}
							size="sm"
							variant="secondary"
						>
							Link {providerDetails.name}
						</BetterAuthActionButton>
					)
				})}
			</CardFooter>
		</Card>
	)
}

// function AccountCard({
// 	account,
// 	provider,
// }: {
// 	account: Account
// 	provider: string
// }) {
// 	const router = useRouter()

// 	const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[
// 		provider as SupportedOAuthProvider
// 	] ?? {
// 		Icon: Shield,
// 		name: provider,
// 	}

// 	const unlinkAccount = useCallback(() => {
// 		if (account == null) {
// 			return Promise.resolve({ error: { message: 'Account not found' } })
// 		}
// 		return authClient.unlinkAccount(
// 			{
// 				accountId: account.accountId,
// 				providerId: provider,
// 			},
// 			{
// 				onSuccess: () => {
// 					router.refresh()
// 				},
// 			}
// 		)
// 	}, [router, provider, account])

// 	return (
// 		<TableRow className="hover:bg-transparent">
// 			<TableCell className="pl-0">
// 				<div className="flex items-center gap-3">
// 					<providerDetails.Icon className="size-4.5" />
// 					<div className="font-semibold">{providerDetails.name}</div>
// 				</div>
// 			</TableCell>
// 			<TableCell className="text-muted-foreground">
// 				{formatDate(account.createdAt)}
// 			</TableCell>
// 			<TableCell className="w-6 pr-0">
// 				<DropdownMenu>
// 					<DropdownMenuTrigger asChild>
// 						<Button
// 							className="size-6 focus-visible:ring-0"
// 							size="icon-sm"
// 							variant="ghost"
// 						>
// 							<MoreHorizontal />
// 						</Button>
// 					</DropdownMenuTrigger>
// 					<DropdownMenuContent>
// 						<DropdownMenuItem onClick={unlinkAccount} variant="destructive">
// 							Unlink Account
// 						</DropdownMenuItem>
// 					</DropdownMenuContent>
// 				</DropdownMenu>
// 			</TableCell>
// 		</TableRow>
// 	)
// }
