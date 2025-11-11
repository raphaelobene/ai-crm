'use client'

import { useTransition } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { toast } from 'sonner'

import { LoadingSwap } from '@/components/loading-swap'
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
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ActionButton({
	action,
	actionButtonText = 'Yes',
	actionButtonClassname,
	areYouSureDescription = 'This action cannot be undone.',
	requireAreYouSure = false,
	...props
}: ComponentProps<typeof Button> & {
	action: () => Promise<{ error: boolean; message?: string }>
	areYouSureDescription?: ReactNode
	actionButtonText?: string
	actionButtonClassname?: string
	requireAreYouSure?: boolean
}) {
	const [isLoading, startTransition] = useTransition()

	function performAction() {
		startTransition(async () => {
			const data = await action()
			if (data.error) {
				toast.error(data.message ?? 'Error')
			} else if (data.message) {
				toast.success(data.message)
			}
		})
	}

	if (requireAreYouSure) {
		return (
			<AlertDialog open={isLoading ? true : undefined}>
				<AlertDialogTrigger asChild>
					<Button {...props} />
				</AlertDialogTrigger>
				<AlertDialogContent className="sm:max-w-xs">
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							{areYouSureDescription}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							className={cn(
								buttonVariants({ variant: 'outline', size: 'sm' }),
								'not-disabled:hover:text-foreground rounded-2xl'
							)}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={isLoading}
							onClick={performAction}
							className={cn(
								buttonVariants({ variant: 'secondary', size: 'sm' }),
								'rounded-2xl',
								actionButtonClassname
							)}
						>
							<LoadingSwap isLoading={isLoading}>
								{actionButtonText}
							</LoadingSwap>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		)
	}

	return (
		<Button
			{...props}
			disabled={props.disabled ?? isLoading}
			onClick={(e) => {
				performAction()
				props.onClick?.(e)
			}}
		>
			<LoadingSwap isLoading={isLoading}>{props.children}</LoadingSwap>
		</Button>
	)
}
