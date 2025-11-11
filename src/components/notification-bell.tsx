'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { Icons } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Notification {
	createdAt: string
	id: string
	message: string
	read: boolean
	title: string
	type: 'error' | 'info' | 'success' | 'warning'
}

export function NotificationBell() {
	const router = useRouter()
	const pathname = usePathname()
	const [notifications, setNotifications] = useState<Notification[]>([])
	const [unreadCount, setUnreadCount] = useState(0)

	// Mock notifications for demo - replace with real data fetching
	useEffect(() => {
		const mockNotifications: Notification[] = [
			{
				createdAt: new Date().toISOString(),
				id: '1',
				message: 'You have been assigned a new lead: Acme Corp',
				read: false,
				title: 'New lead assigned',
				type: 'info',
			},
			{
				createdAt: new Date(Date.now() - 3600000).toISOString(),
				id: '2',
				message: 'Congratulations! Deal with TechStart Inc has been won.',
				read: false,
				title: 'Deal closed',
				type: 'success',
			},
			{
				createdAt: new Date(Date.now() - 7200000).toISOString(),
				id: '3',
				message: 'Follow-up with Global Solutions is overdue by 2 days.',
				read: true,
				title: 'Follow-up overdue',
				type: 'warning',
			},
		]

		setNotifications(mockNotifications)
		setUnreadCount(mockNotifications.filter((n) => !n.read).length)
	}, [])

	// const markAsRead = (notificationId: string) => {
	//   setNotifications((prev) =>
	//     prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
	//   );
	//   setUnreadCount((prev) => prev - 1);
	// };

	// const formatRelativeTime = (dateString: string) => {
	//   const date = new Date(dateString);
	//   const now = new Date();
	//   const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

	//   if (diffInMinutes < 1) return "Just now";
	//   if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
	//   if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
	//   return `${Math.floor(diffInMinutes / 1440)}d ago`;
	// };

	return (
		<Button
			className="text-muted-foreground relative bg-transparent not-disabled:hover:bg-transparent focus-visible:ring-0"
			onClick={() => router.push('/notifications')}
			size="icon"
		>
			<Icons.bell
				className={cn('size-5', {
					'fill-muted-foreground': pathname === '/notifications',
				})}
			/>
			{unreadCount > 0 && (
				<Badge className="ring-background absolute top-2 right-2 size-1.5 rounded-full p-0 ring-2" />
			)}
		</Button>
	)
}
