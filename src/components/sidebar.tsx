'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'

import { useClickAway } from '@/hooks/use-click-away'
import { site } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/providers/sidebar-provider'

import { Icons } from './icons'
import { Button, buttonVariants } from './ui/button'

const SidebarOverlay = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'> & {
		state: 'open' | 'closed'
	}
>(({ className, state, ...props }, ref) => {
	return (
		<div
			data-state={state}
			className={cn(
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-41 bg-black/80 data-[state=closed]:invisible data-[state=open]:visible',
				className
			)}
			{...props}
			ref={ref}
		/>
	)
})

const sidebarVariants = cva(
	'bg-background border-border group peer fixed inset-y-0 z-41 flex w-[375px] max-w-full translate-x-0 transform flex-col gap-4 overflow-hidden transition-transform *:pointer-events-auto data-[state=open]:translate-x-0 md:w-64 data-[state=closed]:md:translate-x-0',
	{
		variants: {
			variant: {
				sidebar: '',
				floating: 'shadow',
				inset: 'shadow',
			},
			side: {
				left: 'left-0 border-r data-[state=closed]:-translate-x-full',
				right: 'right-0 border-l data-[state=closed]:translate-x-full',
			},
		},
		defaultVariants: {
			variant: 'sidebar',
			side: 'left',
		},
	}
)

interface SidebarProps
	extends React.ComponentProps<'div'>,
		VariantProps<typeof sidebarVariants> {}

function Sidebar({
	side,
	variant,
	className,
	children,
	...props
}: SidebarProps) {
	const { state, setOpenMobile, isMobile } = useSidebar()
	const ref = useClickAway<HTMLDivElement>(() => setOpenMobile(false))

	return (
		<>
			{isMobile && <SidebarOverlay state={state} />}
			<aside
				ref={ref}
				data-sidebar="sidebar"
				data-state={state}
				data-side={side}
				data-variant={variant}
				className={cn(sidebarVariants({ side }), className)}
				{...props}
			>
				{children}
			</aside>
		</>
	)
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = ({ children, className }: SidebarHeaderProps) => {
	return (
		<div
			data-sidebar="header"
			className={cn(
				'flex h-12.5 items-center justify-between gap-3 px-6 py-4',
				className
			)}
		>
			<div className='flex h-full flex-1 items-center gap-2 [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-6 md:[&_svg:not([class*="size-"])]:size-7'>
				<span className="sr-only">{site.name} logo</span>
				<Icons.logo />
				<span className="font-semibold md:text-lg">{site.name}</span>
			</div>
			{children}
		</div>
	)
}

const SidebarContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			data-sidebar="content"
			className={cn('h-[--sidebar-height] flex-1', className)}
			{...props}
		/>
	)
})

const SidebarGroup = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			data-sidebar="group"
			className={cn('relative w-full p-6', className)}
			{...props}
		/>
	)
})

const SidebarGroupLabel = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'div'

	return (
		<Comp
			ref={ref}
			data-sidebar="group-label"
			className={cn(
				'text-muted-foreground flex shrink-0 items-center text-xs font-medium',
				className
			)}
			{...props}
		/>
	)
})

const SidebarGroupContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="group-content"
		className={cn('flex w-full flex-col gap-3', className)}
		{...props}
	/>
))

const SidebarMenu = React.forwardRef<
	HTMLUListElement,
	React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
	<ul
		ref={ref}
		data-sidebar="menu"
		className={cn('flex w-full min-w-0 flex-col px-3', className)}
		{...props}
	/>
))

function SidebarMenuItem({ ...props }: React.ComponentProps<'li'>) {
	return <li data-sidebar="menu-item" {...props} />
}

function SidebarMenuButton({
	className,
	...props
}: React.ComponentProps<typeof Button>) {
	return (
		<Button
			data-sidebar="menu-button"
			className={cn(
				'peer/menu-button group-has-data-[sidebar=menu-action]/menu-item:pr-8',
				className
			)}
			{...props}
		/>
	)
}
type SidebarMenuActionProps<T extends React.ElementType = 'button'> = {
	as?: T
	className?: string
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className'> &
	VariantProps<typeof buttonVariants>

function SidebarMenuAction<T extends React.ElementType = 'button'>({
	as,
	className,
	variant,
	size,
	onClick,
	...props
}: SidebarMenuActionProps<T>) {
	const { setOpenMobile } = useSidebar()
	const Comp = as ?? 'button'

	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		if (as === 'a') {
			setOpenMobile(false)
		}

		onClick?.(e as any)
	}

	return (
		<Comp
			aria-label="Menu action"
			data-sidebar="menu-action"
			className={cn(
				buttonVariants({ variant, size }),
				'group aria-[current]:text-foreground aria-[current]:bg-muted dark:aria-[current]:bg-muted/50 text-muted-foreground hover:text-foreground focus-visible:bg-muted not-disabled:hover:bg-muted dark:not-disabled:hover:bg-muted/50 flex justify-start gap-2 bg-transparent px-3 focus-visible:outline-hidden',
				className
			)}
			onClick={handleClick}
			{...props}
		/>
	)
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
	return (
		<ul
			data-sidebar="menu-sub"
			className={cn(
				// 'absolute inset-0 -translate-x-full space-y-2 bg-background px-6 transition-transform ease-in-out',
				className
			)}
			{...props}
		/>
	)
}

const SidebarMenuSubItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentProps<'li'>
>(({ ...props }, ref) => <li ref={ref} {...props} />)

export interface SidebarCloseProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	asChild?: boolean
	iconClassName?: string
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarFooter = ({ className, ...props }: SidebarFooterProps) => {
	return (
		<div
			data-sidebar="footer"
			className={cn('flex px-3 has-[>button]:flex-col', className)}
			{...props}
		/>
	)
}

function SidebarClose({
	className,
	iconClassName,
	...props
}: SidebarCloseProps) {
	const { toggleSidebar } = useSidebar()

	return (
		<Button
			data-sidebar="trigger"
			onClick={toggleSidebar}
			aria-label="close sidebar"
			variant="ghost"
			size="icon-sm"
			className={cn('md:hidden', className)}
			{...props}
		>
			<Icons.x aria-hidden="true" className={cn('size-6', iconClassName)} />
		</Button>
	)
}

export {
	Sidebar,
	SidebarClose,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
}
