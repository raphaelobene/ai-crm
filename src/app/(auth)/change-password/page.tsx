'use client'

import React, { use } from 'react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { ChangePassword } from '@/features/auth/components/change-password'
import { cn } from '@/lib/utils'

export default function ChangePasswordPage({ searchParams }: SearchParamProps) {
	const { error, token } = use(searchParams)

	return (
		<AuthWrapper
			description={
				token == null || error != null
					? 'The password reset link is invalid or has expired.'
					: 'Your password must be different from your previous one.'
			}
			title={
				token == null || error != null
					? 'Invalid Reset Link'
					: 'Set up a New Password'
			}
		>
			{token == null || error != null ? (
				<Link
					className={cn(buttonVariants({ size: 'sm' }), '')}
					href="/sign-in"
				>
					Back to Sign in
				</Link>
			) : (
				<ChangePassword />
			)}
		</AuthWrapper>
	)
}
