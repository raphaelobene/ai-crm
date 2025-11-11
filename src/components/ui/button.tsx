import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
	"focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		defaultVariants: {
			size: 'default',
			variant: 'default',
		},
		variants: {
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				icon: 'size-9',
				'icon-lg': 'size-10',
				'icon-sm': 'size-8',
				lg: 'h-12 rounded-2xl px-6 has-[>svg]:px-4',
				sm: 'h-8 gap-1 px-3 has-[>svg]:px-2.5',
			},
			variant: {
				default:
					'bg-primary text-primary-foreground not-disabled:hover:bg-primary/90',
				destructive:
					'bg-destructive not-disabled:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white',
				ghost:
					'not-disabled:hover:bg-muted not-disabled:hover:text-muted-foreground dark:not-disabled:hover:bg-muted/50',
				link: 'text-primary underline-offset-4 not-disabled:hover:underline',
				outline:
					'bg-background not-disabled:hover:bg-accent not-disabled:hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:not-disabled:hover:bg-input/50 border',
				secondary:
					'bg-secondary text-secondary-foreground not-disabled:hover:bg-secondary/80',
			},
		},
	}
)

function Button({
	asChild = false,
	className,
	size,
	variant,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}) {
	const Comp = asChild ? Slot : 'button'

	return (
		<Comp
			className={cn(buttonVariants({ className, size, variant }))}
			data-slot="button"
			{...props}
		/>
	)
}

export { Button, buttonVariants }
