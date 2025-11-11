import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth/auth'

export default async function layout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await auth.api.getSession({ headers: await headers() })
	if (session !== null) return redirect('/')

	return (
		<div className="from-background to-background/80 flex min-h-screen items-center justify-center bg-linear-to-b p-4">
			<div className="w-full max-w-lg">
				<div className="text-center">
					<div className="inline-flex items-center justify-center space-x-2">
						<div className="bg-muted text-primary flex size-12 items-center justify-center rounded-lg border text-3xl font-extrabold">
							P
						</div>
					</div>
				</div>
				{children}
			</div>
		</div>
	)
}
