import React from 'react'

export default function LeadFunnel({
	userId,
	userRole,
}: {
	userId: string
	userRole: string
}) {
	return (
		<div>
			LeadFunnel {userId}, {userRole}
		</div>
	)
}
