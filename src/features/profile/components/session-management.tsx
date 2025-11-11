'use client'

import { useRouter } from 'next/navigation'
import { Session } from 'better-auth'
import { UAParser } from 'ua-parser-js'

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { Icons } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { authClient } from '@/lib/auth/auth-client'
import { cn, formatDate } from '@/lib/utils'

export function SessionManagement({
	currentSessionToken,
	sessions,
}: {
	currentSessionToken: string
	sessions: Session[]
}) {
	const router = useRouter()

	const otherSessions = sessions.filter((s) => s.token !== currentSessionToken)
	const currentSession = sessions.find((s) => s.token === currentSessionToken)

	function revokeOtherSessions() {
		return authClient.revokeOtherSessions(undefined, {
			onSuccess: () => {
				router.refresh()
			},
		})
	}

	return (
		<Card>
			{currentSession && (
				<CardContent>
					<SessionCard isCurrentSession session={currentSession} />
				</CardContent>
			)}
			<div className="flex flex-col gap-2">
				<CardHeader>
					<CardTitle>Other Active Sessions</CardTitle>
					{otherSessions.length > 0 && (
						<CardAction>
							<BetterAuthActionButton
								action={revokeOtherSessions}
								className={cn({
									'bg-destructive/20 text-destructive not-disabled:hover:bg-destructive/25':
										currentSession,
								})}
								size="sm"
							>
								Revoke other sessions
							</BetterAuthActionButton>
						</CardAction>
					)}
				</CardHeader>
				<CardContent>
					{otherSessions.length === 0 ? (
						<CardDescription>No other active sessions</CardDescription>
					) : (
						<div className="space-y-3">
							{otherSessions.map((session) => (
								<SessionCard key={session.id} session={session} />
							))}
						</div>
					)}
				</CardContent>
			</div>
		</Card>
	)
}

function SessionCard({
	isCurrentSession = false,
	session,
}: {
	isCurrentSession?: boolean
	session: Session
}) {
	const router = useRouter()
	const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null

	function getBrowserInformation() {
		if (userAgentInfo == null) return 'Unknown Device'
		if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
			return 'Unknown Device'
		}

		if (userAgentInfo.browser.name == null) return userAgentInfo.os.name
		if (userAgentInfo.os.name == null) return userAgentInfo.browser.name

		return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`
	}

	function revokeSession() {
		return authClient.revokeSession(
			{
				token: session.token,
			},
			{
				onSuccess: () => {
					router.refresh()
				},
			}
		)
	}

	return (
		<Card className="gap-4">
			<CardHeader className="flex items-center">
				<CardTitle>{getBrowserInformation()}</CardTitle>
				{isCurrentSession && (
					<Badge className="bg-accent text-accent-foreground">
						Current Session
					</Badge>
				)}
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6">
						{userAgentInfo?.device.type === 'mobile' ? (
							<Icons.mobile />
						) : (
							<Icons.desktop />
						)}
						<div>
							<p className="text-muted-foreground text-xs font-medium">
								Created: {formatDate(session.createdAt)}
							</p>
							<p className="text-muted-foreground text-xs font-medium">
								Expires: {formatDate(session.expiresAt)}
							</p>
						</div>
					</div>
					{!isCurrentSession && (
						<BetterAuthActionButton
							action={revokeSession}
							className="bg-destructive/20 text-destructive not-disabled:hover:bg-destructive/25"
							successMessage="Session revoked"
							size="icon-sm"
						>
							<Icons.trash className="stroke-2" />
						</BetterAuthActionButton>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
