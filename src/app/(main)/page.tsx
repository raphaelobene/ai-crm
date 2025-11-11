import { headers } from 'next/headers'

import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from '@/components/page-header'
import {
	DashboardOverview,
	LeadFunnel,
	RecentActivity,
	SalesMetrics,
	TopPerformers,
} from '@/features/dashboard/components'
import { auth } from '@/lib/auth/auth'

export default async function Home() {
	const session = await auth.api.getSession({ headers: await headers() })

	return (
		<>
			<PageHeader className="flex-col items-start gap-3">
				<PageHeaderHeading>
					Welcome back, {session?.user.name?.split(' ')[0] || 'User'}
				</PageHeaderHeading>
				<PageHeaderDescription>
					{`Here's what's happening with your sales today`}
				</PageHeaderDescription>
			</PageHeader>
			<div className="space-y-6">
				<DashboardOverview
					userId={session?.user.id ?? ''}
					userRole={session?.user.role ?? ''}
				/>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div className="space-y-6 lg:col-span-2">
						<SalesMetrics
							userId={session?.user.id ?? ''}
							userRole={session?.user.role ?? ''}
						/>
						<LeadFunnel
							userId={session?.user.id ?? ''}
							userRole={session?.user.role ?? ''}
						/>
					</div>

					{/* Sidebar - Activity & Performance */}
					<div className="space-y-6">
						<RecentActivity userId={session?.user.id ?? ''} />
						<TopPerformers userRole={session?.user.role ?? ''} />
					</div>
				</div>
			</div>
		</>
	)
}
