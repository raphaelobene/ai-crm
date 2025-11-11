'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import CustomFormField, { FormFieldType } from '@/components/custom-form-field'
import { LoadingSwap } from '@/components/loading-swap'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth/auth-client'

import { ForgotPasswordInput, forgotPasswordSchema } from '../types'

export function ResetPassword() {
	const router = useRouter()
	const form = useForm<ForgotPasswordInput>({
		defaultValues: {
			email: '',
		},
		resolver: zodResolver(forgotPasswordSchema),
	})

	const { isSubmitting } = form.formState

	async function handleForgotPassword(data: ForgotPasswordInput) {
		await authClient.requestPasswordReset(
			{
				...data,
				redirectTo: '/change-password',
			},
			{
				onError: (error) => {
					toast.error(
						error.error.message || 'Failed to send password reset email'
					)
				},
				onSuccess: () => {
					toast.success('Password reset email sent')
				},
			}
		)
	}

	return (
		<Form {...form}>
			<form
				className="space-y-4"
				onSubmit={form.handleSubmit(handleForgotPassword)}
			>
				<CustomFormField
					fieldType={FormFieldType.INPUT}
					label="Email"
					name="email"
					placeholder="alan.turing@example.com"
					type="email"
					variant="lg"
				/>

				<div className="flex gap-2">
					<Button
						onClick={() => router.back()}
						size="lg"
						type="button"
						variant="outline"
					>
						Back
					</Button>
					<Button
						className="flex-1"
						disabled={isSubmitting}
						size="lg"
						type="submit"
					>
						<LoadingSwap isLoading={isSubmitting}>
							Send Reset Instructions
						</LoadingSwap>
					</Button>
				</div>
			</form>
		</Form>
	)
}
