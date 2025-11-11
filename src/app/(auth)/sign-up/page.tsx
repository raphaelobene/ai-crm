import React from 'react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import AuthWrapper from '@/features/auth/components/auth-wrapper'
import SignupForm from '@/features/auth/components/signup-form'
import { cn } from '@/lib/utils'

export default function page() {
	return (
		<AuthWrapper
			description={
				<>
					Already have an account?{' '}
					<Link
						className={cn(
							buttonVariants({ size: 'lg', variant: 'link' }),
							'h-auto rounded-none p-0 font-normal'
						)}
						href="/sign-in"
					>
						Sign in
					</Link>
				</>
			}
			footer={
				<>
					By signing in, you agree to our{' '}
					<Link
						className={cn(
							buttonVariants({ size: 'sm', variant: 'link' }),
							'h-auto rounded-none p-0 text-xs font-normal'
						)}
						href="/"
					>
						Terms
					</Link>{' '}
					and{' '}
					<Link
						className={cn(
							buttonVariants({ size: 'sm', variant: 'link' }),
							'h-auto rounded-none p-0 text-xs font-normal'
						)}
						href="/"
					>
						Privacy Policy
					</Link>
					.
				</>
			}
			isSocialAllowed
			title="Create a Prometeus Account"
		>
			<SignupForm />
		</AuthWrapper>
	)
}
