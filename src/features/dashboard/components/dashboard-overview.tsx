import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardOverview({
	userId,
	userRole,
}: {
	userId: string
	userRole: string
}) {
	const isLoading = true

	if (isLoading) {
		return (
			<div className="auto-fit-[12rem] grid gap-4">
				{[...Array(4)].map((_, i) => (
					<Skeleton className="h-30 w-full" key={i} />
				))}
			</div>
		)
	}

	return (
		<div>
			DashboardOverview {userId}, {userRole}
		</div>
	)
}
