'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import CustomFormField, { FormFieldType } from '@/components/custom-form-field'
import { LoadingSwap } from '@/components/loading-swap'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth/auth-client'

import { SignupInput, signupSchema } from '../types'

export default function SignupForm() {
	const router = useRouter()
	const form = useForm<SignupInput>({
		defaultValues: {
			email: '',
			name: '',
			password: '',
		},
		resolver: zodResolver(signupSchema),
	})
	const { isSubmitting } = form.formState

	async function onSubmit(data: SignupInput) {
		const res = await authClient.signUp.email(
			{ ...data, callbackURL: '/' },
			{
				onError: (error) => {
					toast.error(error.error.message || 'Failed to create account')
				},
			}
		)
		if (res.error == null && !res.data.user.emailVerified) {
			router.push(`/verify-email?email=${data.email}`)
		}
	}
	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
				<CustomFormField
					fieldType={FormFieldType.INPUT}
					label="Name"
					name="name"
					placeholder="Alan Turing"
					variant="lg"
				/>
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
					variant="lg"
				/>

				<Button
					className="w-full"
					disabled={isSubmitting}
					size="lg"
					type="submit"
				>
					<LoadingSwap isLoading={isSubmitting}>Create Account</LoadingSwap>
				</Button>
			</form>
		</Form>
	)
}
