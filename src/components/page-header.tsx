import { cn } from '@/lib/utils'

function PageActions({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none',
				className
			)}
			{...props}
		/>
	)
}

function PageHeader({
	children,
	className,
	...props
}: React.ComponentProps<'section'>) {
	return (
		<section className="border-grid" {...props}>
			<div className="container-wrapper">
				<div className={cn('container flex items-center py-8', className)}>
					{children}
				</div>
			</div>
		</section>
	)
}

function PageHeaderDescription({
	className,
	...props
}: React.ComponentProps<'p'>) {
	return (
		<p
			className={cn(
				'text-muted-foreground max-w-3xl text-base/snug text-balance sm:text-sm',
				className
			)}
			{...props}
		/>
	)
}

function PageHeaderHeading({
	className,
	...props
}: React.ComponentProps<'h1'>) {
	return (
		<h1
			className={cn(
				'max-w-2xl text-2xl leading-[1.1] font-bold text-balance md:text-3xl xl:text-4xl',
				className
			)}
			{...props}
		/>
	)
}

export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading }
