'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'
import type { ToasterProps } from 'sonner'

import { Icons } from '../icons'

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme()

	return (
		<Sonner
			className="toaster group"
			icons={{
				error: <Icons.shieldX className="size-4" />,
				info: <Icons.infoCircle className="size-4" />,
				loading: <Icons.spinner className="size-4 animate-spin" />,
				success: <Icons.checkCircle className="size-4" />,
				warning: <Icons.alertTriangle className="size-4" />,
			}}
			style={
				{
					'--border-radius': 'var(--radius)',
					'--normal-bg': 'var(--popover)',
					'--normal-border': 'var(--border)',
					'--normal-text': 'var(--popover-foreground)',
				} as React.CSSProperties
			}
			theme={theme as ToasterProps['theme']}
			{...props}
		/>
	)
}

export { Toaster }
