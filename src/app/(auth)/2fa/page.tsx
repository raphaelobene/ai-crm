import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import AuthWrapper from '@/features/auth/components/auth-wrapper'
import { TotpForm } from '@/features/auth/components/totp-form'
import { auth } from '@/lib/auth/auth'

export default async function TwoFactorPage() {
	const session = await auth.api.getSession({ headers: await headers() })
	if (session !== null) return redirect('/')

	return (
		<AuthWrapper title="Two-Factor Authentication">
			<TotpForm />
		</AuthWrapper>
	)
}
