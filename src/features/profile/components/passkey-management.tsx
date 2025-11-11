'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Passkey } from 'better-auth/plugins/passkey'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import CustomFormField, { FormFieldType } from '@/components/custom-form-field'
import { Icons } from '@/components/icons'
import { LoadingSwap } from '@/components/loading-swap'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth/auth-client'
import { cn, formatDate } from '@/lib/utils'

const passkeySchema = z.object({
	name: z.string().min(1),
})

type PasskeyForm = z.infer<typeof passkeySchema>

export function PasskeyManagement({ passkeys }: { passkeys: Passkey[] }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const router = useRouter()
	const form = useForm<PasskeyForm>({
		defaultValues: {
			name: '',
		},
		resolver: zodResolver(passkeySchema),
	})

	const { isSubmitting } = form.formState

	async function handleAddPasskey(data: PasskeyForm) {
		await authClient.passkey.addPasskey(data, {
			onError: (error) => {
				toast.error(error.error.message || 'Failed to add passkey')
			},
			onSuccess: () => {
				router.refresh()
				setIsDialogOpen(false)
			},
		})
	}
	function handleDeletePasskey(passkeyId: string) {
		return authClient.passkey.deletePasskey(
			{ id: passkeyId },
			{ onSuccess: () => router.refresh() }
		)
	}

	return (
		<Card className="gap-0">
			<CardHeader className={cn({ 'mb-4': passkeys.length === 0 })}>
				<CardTitle>Passkeys</CardTitle>

				{passkeys.length === 0 ? (
					<CardDescription>
						Add passkey for a secure, passwordless authentication.
					</CardDescription>
				) : (
					<>
						{passkeys.map((passkey) => (
							<div
								className="flex items-center justify-between gap-2 pt-2"
								key={passkey.id}
							>
								<div className="flex items-center gap-4">
									<CardTitle className="flex-1 text-sm font-medium">
										{passkey.name}
									</CardTitle>
									<CardDescription className="text-xs">
										Created on {formatDate(passkey.createdAt)}
									</CardDescription>
								</div>
								<BetterAuthActionButton
									action={() => handleDeletePasskey(passkey.id)}
									actionButtonText="Delete Passkey"
									actionButtonClassname="bg-destructive/20 text-destructive not-disabled:hover:bg-destructive/25"
									className="bg-destructive/20 text-destructive not-disabled:hover:bg-destructive/25"
									requireAreYouSure
									size="icon-sm"
								>
									<Icons.trash className="stroke-2" />
								</BetterAuthActionButton>
							</div>
						))}
					</>
				)}
			</CardHeader>
			{passkeys.length === 0 && (
				<CardFooter className="border-t">
					<Dialog
						onOpenChange={(o) => {
							if (o) form.reset()
							setIsDialogOpen(o)
						}}
						open={isDialogOpen}
					>
						<DialogTrigger asChild>
							<Button size="sm" variant="outline">
								New Passkey
							</Button>
						</DialogTrigger>
						<DialogContent className="p-3">
							<Form {...form}>
								<form
									className="space-y-3"
									onSubmit={form.handleSubmit(handleAddPasskey)}
								>
									<DialogHeader>
										<DialogTitle>Add New Passkey</DialogTitle>
										<DialogDescription>
											Create a new passkey for secure, passwordless
											authentication.
										</DialogDescription>
									</DialogHeader>
									<CustomFormField
										fieldType={FormFieldType.INPUT}
										label="Name"
										name="name"
										placeholder="Alan Turing"
										variant="sm"
									/>
									<DialogFooter>
										<Button
											className="w-full"
											disabled={isSubmitting}
											type="submit"
											size="sm"
										>
											<LoadingSwap isLoading={isSubmitting}>Add</LoadingSwap>
										</Button>
									</DialogFooter>
								</form>
							</Form>
						</DialogContent>
					</Dialog>
				</CardFooter>
			)}
		</Card>
	)
}
