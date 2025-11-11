import React from 'react'

import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'

type LoadingSwapProps = {
	children: React.ReactNode
	isLoading: boolean
	title?: string
}

export function LoadingSwap({ children, isLoading, title }: LoadingSwapProps) {
	return (
		<>
			<div
				className={cn(
					'absolute inset-x-0 hidden h-full translate-y-3 items-center justify-center space-x-3 opacity-0 transition-all duration-200',
					{
						'flex translate-y-0 opacity-100': isLoading,
					}
				)}
			>
				<Icons.spinner className="w-5 animate-spin" />
				{title && <span>{title}</span>}
			</div>
			<span
				className={cn(
					'flex items-center gap-1.5 opacity-100 transition-opacity duration-200',
					{
						'opacity-0': isLoading,
					}
				)}
			>
				{children}
			</span>
		</>
	)
}
