import React from 'react'

export default function SalesMetrics({
	userId,
	userRole,
}: {
	userId: string
	userRole: string
}) {
	return (
		<div>
			SalesMetrics {userId}, {userRole}
		</div>
	)
}
