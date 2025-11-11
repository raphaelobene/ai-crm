'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import CustomFormField, { FormFieldType } from '@/components/custom-form-field'
import { LoadingSwap } from '@/components/loading-swap'
import { Button, buttonVariants } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth/auth-client'
import { cn } from '@/lib/utils'

import { SigninInput, signinSchema } from '../types'
import { PasskeyButton } from './passkey-button'

export default function SigninForm() {
	const router = useRouter()
	const form = useForm<SigninInput>({
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
		resolver: zodResolver(signinSchema),
	})
	const { isSubmitting } = form.formState

	async function onSubmit(data: SigninInput) {
		await authClient.signIn.email(
			{ ...data, callbackURL: '/' },
			{
				onError: (error) => {
					if (error.error.code === 'EMAIL_NOT_VERIFIED') {
						router.push(`/verify-email?email=${data.email}`)
					}
					toast.error(error.error.message || 'Failed to sign in')
				},
				onSuccess: () => {
					router.push('/')
				},
			}
		)
	}
	return (
		<div className="space-y-4">
			<Form {...form}>
				<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						label="Email"
						name="email"
						placeholder="alan.turing@example.com"
						type="email"
						variant="lg"
					/>

					<CustomFormField
						fieldType={FormFieldType.PASSWORD_INPUT}
						label="Password"
						name="password"
						placeholder="••••••••"
						renderafter={
							<Link
								className={cn(
									buttonVariants({ size: 'lg', variant: 'link' }),
									'h-auto rounded-none p-0 font-normal'
								)}
								href="/reset-password"
							>
								Forgot your password?
							</Link>
						}
						variant="lg"
					/>

					<CustomFormField
						fieldType={FormFieldType.CHECKBOX}
						label="Remember me"
						name="rememberMe"
					/>

					<Button
						className="w-full"
						disabled={isSubmitting}
						size="lg"
						type="submit"
					>
						<LoadingSwap isLoading={isSubmitting}>Sign in</LoadingSwap>
					</Button>
				</form>
			</Form>
			<PasskeyButton />
		</div>
	)
}
