'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import CustomFormField, { FormFieldType } from '@/components/custom-form-field'
import { LoadingSwap } from '@/components/loading-swap'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth/auth-client'

const changePasswordSchema = z.object({
	currentPassword: z.string().min(1),
	newPassword: z.string().min(6),
	revokeOtherSessions: z.boolean(),
})

type ChangePasswordForm = z.infer<typeof changePasswordSchema>

export function ChangePasswordForm() {
	const form = useForm<ChangePasswordForm>({
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			revokeOtherSessions: true,
		},
		resolver: zodResolver(changePasswordSchema),
	})

	const { isSubmitting } = form.formState

	async function handlePasswordChange(data: ChangePasswordForm) {
		await authClient.changePassword(data, {
			onError: (error) => {
				toast.error(error.error.message || 'Failed to change password')
			},
			onSuccess: () => {
				toast.success('Password changed successfully')
				form.reset()
			},
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handlePasswordChange)}>
				<Card className="gap-4">
					<CardHeader>
						<CardTitle>Change Password</CardTitle>
						<CardDescription>
							Update your password for improved security.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<CustomFormField
							fieldType={FormFieldType.PASSWORD_INPUT}
							label="Current Password"
							name="currentPassword"
							placeholder="••••••••"
							variant="sm"
						/>
						<CustomFormField
							fieldType={FormFieldType.PASSWORD_INPUT}
							label="New Password"
							name="newPassword"
							placeholder="••••••••"
							variant="sm"
						/>

						<CustomFormField
							fieldType={FormFieldType.CHECKBOX}
							label="Log out other sessions"
							name="revokeOtherSessions"
						/>
					</CardContent>
					<CardFooter className="border-t">
						<Button
							disabled={isSubmitting}
							size="sm"
							type="submit"
							variant="secondary"
						>
							<LoadingSwap isLoading={isSubmitting}>
								Change Password
							</LoadingSwap>
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
