import React from 'react'

import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { EmailVerification } from '@/features/auth/components/email-verification'

export default function EmailVerificationPage() {
	return (
		<AuthWrapper
			description="We sent you a verification link. Please check your email and click the
            link to verify your account."
			title="Verify your email"
		>
			<EmailVerification />
		</AuthWrapper>
	)
}
