'use client'

import { ColumnDef } from '@tanstack/react-table'
import { UserWithRole } from 'better-auth/plugins/admin'

import HighlightText from '@/components/hightlight-text'
import { Badge } from '@/components/ui/badge'
import { capitalize, formatDate } from '@/lib/utils'

import { CellActions } from './cell-action'

interface UserColumnsProps {
	handleBanUser: (user: UserWithRole) => void
	handleImpersonateUser: (user: UserWithRole) => void
	handleRemoveUser: (user: UserWithRole) => void
	handleRevokeSessions: (user: UserWithRole) => void
	handleUnbanUser: (user: UserWithRole) => void
	selfId: string
	searchTerm?: string
}

export const getUsersColumns = ({
	handleBanUser,
	handleImpersonateUser,
	handleRemoveUser,
	handleRevokeSessions,
	handleUnbanUser,
	selfId,
	searchTerm,
}: UserColumnsProps): ColumnDef<UserWithRole>[] => [
	{
		accessorKey: 'user',
		cell: ({ row }) => (
			<div>
				<div className="flex items-center">
					<span className="font-semibold">
						<HighlightText
							text={row.original.name || 'No name'}
							search={searchTerm}
						/>
					</span>
					<div className="flex items-center gap-1 not-empty:ml-2">
						{row.original.banned && (
							<Badge className="bg-destructive/20 text-destructive">
								Banned
							</Badge>
						)}
						{!row.original.emailVerified && (
							<Badge variant="outline">Unverified</Badge>
						)}
						{row.original.id === selfId && (
							<Badge className="bg-accent text-accent-foreground">You</Badge>
						)}
					</div>
				</div>
				<div className="text-muted-foreground text-sm">
					<HighlightText text={row.original.email} search={searchTerm} />
				</div>
			</div>
		),
		header: 'User',
		filterFn: (row, id, value) => {
			const name = row.original.name || ''
			const email = row.original.email || ''
			const role = row.original.role || ''
			const searchValue = value.toLowerCase().trim()
			return (
				name.toLowerCase() === searchValue ||
				email.toLowerCase() === searchValue ||
				role.toLowerCase() === searchValue
			)
		},
	},
	{
		accessorKey: 'role',
		cell: ({ row }) => (
			<p className="text-muted-foreground text-xs font-normal">
				<HighlightText
					text={capitalize(row.original.role!)}
					search={searchTerm}
				/>
			</p>
		),
		header: 'Role',
		size: 220,
	},
	{
		accessorKey: 'created',
		cell: ({ row }) => (
			<p className="text-muted-foreground text-xs font-normal">
				{formatDate(row.original.createdAt)}
			</p>
		),
		header: 'Created',
		size: 160,
	},
	{
		cell: ({ row }) => {
			return (
				<CellActions
					banned={row.original.banned}
					handleBanUser={handleBanUser}
					handleImpersonateUser={handleImpersonateUser}
					handleRemoveUser={handleRemoveUser}
					handleRevokeSessions={handleRevokeSessions}
					handleUnbanUser={handleUnbanUser}
					isSelf={selfId === row.original.id}
					row={row}
				/>
			)
		},
		id: 'actions',
		size: 40,
	},
]
