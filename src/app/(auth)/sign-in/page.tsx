import React from 'react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import AuthWrapper from '@/features/auth/components/auth-wrapper'
import SigninForm from '@/features/auth/components/signin-form'
import { cn } from '@/lib/utils'

export default function SigninPage() {
	return (
		<AuthWrapper
			description={
				<>
					Don&apos;t have an account?{' '}
					<Link
						className={cn(
							buttonVariants({ size: 'lg', variant: 'link' }),
							'h-auto rounded-none p-0 font-normal'
						)}
						href="/sign-up"
					>
						Sign up
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
			title="Sign in to Prometeus"
		>
			<SigninForm />
		</AuthWrapper>
	)
}
