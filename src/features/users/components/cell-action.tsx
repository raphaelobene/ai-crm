'use client'

import { Row } from '@tanstack/react-table'

import { Icons } from '@/components/icons'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CellActionsProps<TData> {
	banned?: boolean | null
	handleBanUser: (value: TData) => void
	handleImpersonateUser: (value: TData) => void
	handleRemoveUser: (value: TData) => void
	handleRevokeSessions: (value: TData) => void
	handleUnbanUser: (value: TData) => void
	isSelf: boolean
	row: Row<TData>
}
export const CellActions = <TData,>({
	banned,
	handleBanUser,
	handleImpersonateUser,
	handleRemoveUser,
	handleRevokeSessions,
	handleUnbanUser,
	isSelf,
	row,
}: CellActionsProps<TData>) => {
	return (
		<>
			{!isSelf && (
				<AlertDialog>
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
								onClick={() => handleImpersonateUser(row.original)}
							>
								Impersonate
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleRevokeSessions(row.original)}
							>
								Revoke Sessions
							</DropdownMenuItem>
							{banned ? (
								<DropdownMenuItem onClick={() => handleUnbanUser(row.original)}>
									Unban User
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem onClick={() => handleBanUser(row.original)}>
									Ban User
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />

							<AlertDialogTrigger asChild>
								<DropdownMenuItem variant="destructive">
									Delete User
								</DropdownMenuItem>
							</AlertDialogTrigger>
						</DropdownMenuContent>
					</DropdownMenu>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete User</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete this user? This action cannot be
								undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								onClick={() => handleRemoveUser(row.original)}
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</>
	)
}
