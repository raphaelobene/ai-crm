'use client'

import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { UserWithRole } from 'better-auth/plugins/admin'
import { toast } from 'sonner'

import { DataTable } from '@/components/data-table'
import { authClient } from '@/lib/auth/auth-client'

import { getUsersColumns } from './columns'

export default function UserList({
	selfId,
	users,
}: {
	selfId: string
	users: UserWithRole[]
}) {
	const { refetch } = authClient.useSession()
	const router = useRouter()

	const handleImpersonateUser = useCallback(
		(user: UserWithRole) => {
			authClient.admin.impersonateUser(
				{ userId: user.id },
				{
					onError: (error) => {
						toast.error(error.error.message || 'Failed to impersonate')
					},
					onSuccess: () => {
						router.push('/')
						router.refresh()
						refetch()
					},
				}
			)
		},
		[refetch, router]
	)

	const handleBanUser = useCallback(
		(user: UserWithRole) => {
			authClient.admin.banUser(
				{ userId: user.id },
				{
					onError: (error) => {
						toast.error(error.error.message || 'Failed to ban user')
					},
					onSuccess: () => {
						toast.success('User banned')
						router.refresh()
					},
				}
			)
		},
		[router]
	)

	const handleUnbanUser = useCallback(
		(user: UserWithRole) => {
			authClient.admin.unbanUser(
				{ userId: user.id },
				{
					onError: (error) => {
						toast.error(error.error.message || 'Failed to unban user')
					},
					onSuccess: () => {
						toast.success('User unbanned')
						router.refresh()
					},
				}
			)
		},
		[router]
	)

	const handleRevokeSessions = useCallback((user: UserWithRole) => {
		authClient.admin.revokeUserSessions(
			{ userId: user.id },
			{
				onError: (error) => {
					toast.error(error.error.message || 'Failed to revoke user sessions')
				},
				onSuccess: () => {
					toast.success('User sessions revoked')
				},
			}
		)
	}, [])

	const handleRemoveUser = useCallback(
		(user: UserWithRole) => {
			authClient.admin.removeUser(
				{ userId: user.id },
				{
					onError: (error) => {
						toast.error(error.error.message || 'Failed to delete user')
					},
					onSuccess: () => {
						toast.success('User deleted')
						router.refresh()
					},
				}
			)
		},
		[router]
	)

	const columns = useMemo(
		() => (searchTerm: string) =>
			getUsersColumns({
				handleBanUser,
				handleImpersonateUser,
				handleRemoveUser,
				handleRevokeSessions,
				handleUnbanUser,
				selfId,
				searchTerm,
			}),
		[
			handleImpersonateUser,
			handleBanUser,
			handleUnbanUser,
			handleRevokeSessions,
			handleRemoveUser,
			selfId,
		]
	)

	return (
		<DataTable
			columns={columns}
			data={users}
			searchKey="user"
			searchPlaceholder="Search users"
			showTableHeader
		/>
	)
}
