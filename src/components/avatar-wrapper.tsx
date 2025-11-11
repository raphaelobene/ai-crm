import { User } from '@/lib/auth/auth'
import { cn, getInitials } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

type AvatarWrapperProps = {
	user: User
}
export default function AvatarWrapper({
	className,
	user,
	...props
}: AvatarWrapperProps & React.ComponentProps<'div'>) {
	return (
		<Avatar className={cn(className)} {...props}>
			<AvatarImage src={user?.image || undefined} />
			<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
		</Avatar>
	)
}
