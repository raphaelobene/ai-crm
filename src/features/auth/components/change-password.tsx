'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import CustomFormField, { FormFieldType } from '@/components/custom-form-field'
import { LoadingSwap } from '@/components/loading-swap'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth/auth-client'

import { ResetPasswordInput, resetPasswordSchema } from '../types'

export function ChangePassword() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const form = useForm<ResetPasswordInput>({
		defaultValues: {
			confirmPassword: '',
			password: '',
		},
		resolver: zodResolver(resetPasswordSchema),
	})

	const { isSubmitting } = form.formState

	async function onSubmit(data: ResetPasswordInput) {
		if (token == null) return

		await authClient.resetPassword(
			{
				newPassword: data.password,
				token,
			},
			{
				onError: (error) => {
					toast.error(error.error.message || 'Failed to reset password')
				},
				onSuccess: () => {
					toast.success('Password reset successful', {
						description: 'Redirection to login...',
					})
					setTimeout(() => {
						router.push('/sign-in')
					}, 1000)
				},
			}
		)
	}

	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
				<CustomFormField
					fieldType={FormFieldType.PASSWORD_INPUT}
					label="Password"
					name="password"
					placeholder="••••••••"
					variant="lg"
				/>
				<CustomFormField
					fieldType={FormFieldType.PASSWORD_INPUT}
					label="Confirm Password"
					name="confirmPassword"
					placeholder="••••••••"
					variant="lg"
				/>

				<div className="flex gap-2">
					<Button
						className="flex-1"
						disabled={isSubmitting}
						size="lg"
						type="submit"
					>
						<LoadingSwap isLoading={isSubmitting}>Change Password</LoadingSwap>
					</Button>
				</div>
			</form>
		</Form>
	)
}
