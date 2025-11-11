'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { auth } from '@/lib/auth/auth'
import {
	SUPPORTED_OAUTH_PROVIDER_DETAILS,
	SupportedOAuthProvider,
} from '@/lib/auth/o-auth-providers'
import { formatDate } from '@/lib/utils'

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number]

interface AccountColumnProps {
	unlinkAccount: (account: Account) => void
}

export const getAccountColumns = ({
	unlinkAccount,
}: AccountColumnProps): ColumnDef<Account>[] => [
	{
		accessorKey: 'account',
		cell: ({ row }) => {
			const provider =
				SUPPORTED_OAUTH_PROVIDER_DETAILS[
					row.original.providerId as SupportedOAuthProvider
				]

			return (
				<div className="flex flex-1 items-center gap-3">
					<provider.Icon className="size-4.5" />
					<div className="font-semibold">{provider.name}</div>
				</div>
			)
		},
		header: 'Account',
	},
	{
		accessorKey: 'linked',
		cell: ({ row }) => (
			<p className="text-muted-foreground text-xs font-normal">
				Connected on {formatDate(row.original.createdAt)}
			</p>
		),
		header: 'Linked',
		size: 160,
	},
	{
		cell: ({ row }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							className="text-muted-foreground focus-visible:ring-0"
							size="icon-sm"
							variant="ghost"
						>
							<Icons.moreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							onClick={() => unlinkAccount(row.original)}
							variant="destructive"
						>
							Unlink Account
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
		id: 'actions',
		size: 40,
	},
]
