import React from 'react'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { ImpersonationIndicator } from '@/components/auth/impersonation-indicator'
import ClientOnly from '@/components/client-only'
import DashboardLayout from '@/components/dashboard-layout'
import { auth } from '@/lib/auth/auth'
import SidebarProvider from '@/providers/sidebar-provider'

export default async function Layout({
	children,
}: {
	children: React.ReactNode
}) {
	const cookieStore = await cookies()
	const session = await auth.api.getSession({ headers: await headers() })
	if (session === null) return redirect('/sign-in')

	const hasAccess = await auth.api.userHasPermission({
		body: { permission: { user: ['list'] } },
		headers: await headers(),
	})
	const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<ClientOnly>
				<DashboardLayout hasAccess={hasAccess.success} session={session}>
					{children}
					<ImpersonationIndicator />
				</DashboardLayout>
			</ClientOnly>
		</SidebarProvider>
	)
}
