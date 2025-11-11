import React from 'react'
import { headers } from 'next/headers'

import ClientOnly from '@/components/client-only'
import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from '@/components/page-header'
import UserList from '@/features/users/components/user-list'
import { auth } from '@/lib/auth/auth'
import { getPageInfo } from '@/lib/constants'

export default async function AdminPage() {
	const headerList = await headers()
	const session = await auth.api.getSession({ headers: await headers() })
	const data = await auth.api.listUsers({
		headers: await headers(),
		query: { limit: 100, sortBy: 'createdAt', sortDirection: 'desc' },
	})

	const pathname = headerList.get('x-current-path')
	const { description, name } = getPageInfo(pathname!)

	if (!session) {
		return null
	}

	return (
		<>
			<PageHeader className="flex-col items-start gap-3">
				<PageHeaderHeading>{name}</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
			</PageHeader>

			<ClientOnly>
				<UserList selfId={session.user.id} users={data.users} />
			</ClientOnly>
		</>
	)
}
