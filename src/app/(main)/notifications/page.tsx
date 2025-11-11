import React from 'react'
import { headers } from 'next/headers'

import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from '@/components/page-header'
import { getPageInfo } from '@/lib/constants'

export default async function NotificationPage() {
	const headerList = await headers()
	const pathname = headerList.get('x-current-path')
	const { description } = getPageInfo(pathname!)

	return (
		<>
			<PageHeader className="flex-col items-start gap-3">
				<PageHeaderHeading>What&apos;s New</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
			</PageHeader>
		</>
	)
}
