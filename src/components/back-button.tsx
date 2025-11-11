'use client'

import { ComponentProps, useCallback } from 'react'
import { useRouter } from 'next/navigation'

import { Icons } from './icons'
import { Button } from './ui/button'

export default function BackButton({
	title,
	...props
}: ComponentProps<typeof Button> & {
	title?: string
}) {
	const router = useRouter()

	const onClick = useCallback(() => router.back(), [router])

	return (
		<Button {...props} onClick={onClick} title={title || 'Back'}>
			<span className="sr-only">{title || 'Back'}</span>
			<Icons.arrowLeft className="size-5" />
			{title}
		</Button>
	)
}
