'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

import { Session, User } from '@/lib/auth/auth'
import { authClient } from '@/lib/auth/auth-client'
import { adminNavigation, getPageInfo, navigation } from '@/lib/constants'
import { useSidebar } from '@/providers/sidebar-provider'

import AvatarWrapper from './avatar-wrapper'
import BackButton from './back-button'
import Breadcrumb from './breadcrumb'
import ClientOnly from './client-only'
import { Icons } from './icons'
import { NotificationBell } from './notification-bell'
import {
	Sidebar,
	SidebarClose,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuItem,
} from './sidebar'
import { Button } from './ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Separator } from './ui/separator'

export default function DashboardLayout({
	children,
	hasAccess,
	session,
}: {
	children: React.ReactNode
	hasAccess: boolean
	session: Session
}) {
	const { toggleSidebar, isMobile } = useSidebar()
	const pathname = usePathname()
	const { name: currentPageText } = getPageInfo(pathname)

	return (
		<div className="min-h-screen">
			<Sidebar
				className="left-[max(0px,calc(50%-45rem))] max-w-[calc(100%-3rem)] gap-3"
				variant={isMobile ? 'floating' : 'sidebar'}
			>
				<SidebarHeader>
					<SidebarClose />
				</SidebarHeader>
				<SidebarContent className="flex flex-col justify-between pb-3">
					<SidebarMenu className="space-y-2">
						{navigation.map((item) => {
							const Icon = item.icon
							const isActive =
								pathname === item.href ||
								(item.href !== '/' && pathname.startsWith(item.href))

							return (
								<SidebarMenuItem key={item.name}>
									<SidebarMenuAction
										as="a"
										size="sm"
										aria-current={isActive ? 'page' : undefined}
										href={item.href}
									>
										<Icon />
										{item.name}
									</SidebarMenuAction>
								</SidebarMenuItem>
							)
						})}
					</SidebarMenu>

					<SidebarFooter>
						<UserProfileButton hasAccess={hasAccess} user={session.user} />
					</SidebarFooter>
				</SidebarContent>
			</Sidebar>
			<div className="md:pl-64">
				<main className="min-h-screen pb-20">
					<header className="bg-background sticky top-0 z-10 flex h-15 items-center justify-between border-b px-6 py-4">
						<div className="flex items-center space-x-4">
							<button
								className="inline-flex size-10 items-center justify-center md:hidden [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-10"
								onClick={toggleSidebar}
							>
								<Icons.logo className="size-10" />
							</button>

							{!isMobile && (
								<div className="inline-flex items-center gap-4">
									{pathname !== '/' ? (
										<>
											<div className="hidden items-center gap-1 lg:inline-flex">
												<BackButton
													className="hover:text-secondary-foreground hover:bg-transparent dark:hover:bg-transparent"
													size="icon"
													variant="ghost"
												/>
												<Separator
													className="data-[orientation=vertical]:h-3.5"
													orientation="vertical"
												/>
											</div>
											<Breadcrumb
												className="hidden md:flex"
												currentPageText={currentPageText}
												showFullPath
											/>
										</>
									) : (
										<div className="text-muted-foreground text-sm/7 transition-colors">
											{currentPageText}
										</div>
									)}
								</div>
							)}
						</div>

						<div className="flex items-center space-x-4">
							<ClientOnly>
								<NotificationBell />
							</ClientOnly>
						</div>
					</header>
					<div className="container mx-auto px-6 md:px-14">{children}</div>
				</main>
			</div>
		</div>
	)
}

const UserProfileButton = ({
	hasAccess,
	user,
}: {
	hasAccess: boolean
	user: User
}) => {
	const router = useRouter()
	const { setOpenMobile } = useSidebar()
	const { setTheme, resolvedTheme } = useTheme()
	const isDarkTheme = resolvedTheme === 'dark'

	const toggleTheme = React.useCallback(
		() => setTheme(isDarkTheme ? 'light' : 'dark'),
		[isDarkTheme, setTheme]
	)

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
			const modifier = isMac ? e.metaKey : e.ctrlKey

			if (modifier && e.key.toLowerCase() === 'k') {
				e.preventDefault()
				toggleTheme()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [toggleTheme])

	const filteredAdminNavigation = adminNavigation.filter(
		(item) => hasAccess || item.href !== '/admin/users'
	)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="text-muted-foreground not-disabled:hover:bg-muted dark:not-disabled:hover:bg-muted/50 gap-3 bg-transparent focus-visible:ring-0 has-[>svg]:px-1.5"
					size="sm"
				>
					<div className="flex flex-1 items-center gap-3 overflow-hidden">
						<AvatarWrapper user={user} className="size-6" />
						<span className="truncate">{user.email}</span>
					</div>
					<Icons.moreHorizontal />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="center"
				className="mr-3 grid max-h-96 max-w-[218px] min-w-[218px]"
			>
				{filteredAdminNavigation.map((item) => {
					const Icon = item.icon

					return (
						<DropdownMenuItem
							className="justify-start"
							key={item.name}
							onClick={() => {
								router.push(item.href)
								setOpenMobile(false)
							}}
						>
							<Icon /> {item.name}
						</DropdownMenuItem>
					)
				})}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="justify-start"
					onClick={() => {
						toggleTheme()
						setOpenMobile(false)
					}}
				>
					{isDarkTheme ? <Icons.moon /> : <Icons.sun />}
					Toggle theme
					<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="justify-start"
					onClick={() =>
						authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									router.push('/sign-in')
								},
							},
						})
					}
				>
					<Icons.signOut /> Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
