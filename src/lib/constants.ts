import { Icons } from '@/components/icons'

export const site = {
	description:
		'Manage your customer relationships efficiently and effectively with our powerful CRM solution.',
	name: 'Prometeus CRM',
	ogImage: '/og.png',
	url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
}

export const navigation = [
	{
		description: 'Overview and key metrics',
		href: '/',
		icon: Icons.home,
		name: 'Dashboard',
	},
	{
		description: 'Manage your contacts and leads',
		href: '/',
		icon: Icons.contactBook,
		name: 'Contacts',
	},
	{
		description: 'Company and account management',
		href: '/',
		icon: Icons.building,
		name: 'Companies',
	},
	{
		description: 'Sales pipeline and opportunities',
		href: '/',
		icon: Icons.currencyNotes,
		name: 'Deals',
	},
	{
		description: 'Tasks, calls, and meetings',
		href: '/',
		icon: Icons.calendarDetail,
		name: 'Activities',
	},
	{
		description: 'Analytics and insights',
		href: '/',
		icon: Icons.pieChart,
		name: 'Reports',
	},
	{
		description: 'Team management',
		href: '/',
		icon: Icons.group,
		name: 'Team',
	},
] as const

export const adminNavigation = [
	{
		description: 'Manage user accounts, roles, and permissions',
		href: '/admin/users',
		name: 'User Management',
		icon: Icons.userCircle,
	},
	{
		description: 'Configure system settings',
		href: '/admin/settings',
		name: 'System Settings',
		icon: Icons.settings,
	},
] as const

const otherNavigation = [
	{
		description: 'Alerts and recent updates',
		href: '/notifications',
		icon: Icons.bell,
		name: 'Notifications',
	},
]

type PageInfo = {
	description: string
	name: string
}

export function getPageInfo(pathname: string): PageInfo {
	const path = normalizePath(pathname)
	const allNavs = [...navigation, ...adminNavigation, ...otherNavigation]

	const exact = allNavs.find((item) => normalizePath(item.href) === path)
	if (exact)
		return {
			description: exact.description,
			name: exact.name,
		}

	const sorted = allNavs
		.slice()
		.sort((a, b) => normalizePath(b.href).length - normalizePath(a.href).length)

	const prefix = sorted.find((item) => {
		const href = normalizePath(item.href)
		if (href === '/') return false
		return path === href || path.startsWith(href + '/')
	})

	if (prefix)
		return {
			description: prefix.description,
			name: prefix.name,
		}

	const dashboard = allNavs.find((i) => i.href === '/')
	return {
		description: dashboard ? dashboard.description : 'Overview and key metrics',
		name: dashboard ? dashboard.name : 'Dashboard',
	}
}

function normalizePath(p: string) {
	if (!p) return '/'
	const q = p.split('?')[0].split('#')[0]
	return q !== '/' && q.endsWith('/') ? q.slice(0, -1) : q
}
