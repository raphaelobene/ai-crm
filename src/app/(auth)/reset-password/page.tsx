import React from 'react'

import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { ResetPassword } from '@/features/auth/components/reset-password'

export default function ResetPasswordPage() {
	return (
		<AuthWrapper
			description="Include the email address associated with your account and we'll send you an email with instructions to reset your password."
			title="Reset Password"
		>
			<ResetPassword />
		</AuthWrapper>
	)
}
