'use client'

import { ComponentProps, useState } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { Icons } from './icons'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from './ui/input-group'

export function PasswordInput({
	className,
	...props
}: Omit<ComponentProps<typeof Input>, 'type'>) {
	const [showPassword, setShowPassword] = useState(false)
	const Icon = showPassword ? Icons.eyeClosed : Icons.eye

	return (
		<InputGroup>
			<InputGroupInput
				className={cn(className)}
				type={showPassword ? 'text' : 'password'}
				{...props}
				variant="sm"
			/>
			<InputGroupAddon align="inline-end">
				<InputGroupButton
					className="not-disabled:hover:bg-transparent dark:not-disabled:hover:bg-transparent"
					onClick={() => setShowPassword((prev) => !prev)}
					size="icon-xs"
					type="button"
					variant="ghost"
				>
					<Icon aria-hidden="true" />
					<span className="sr-only">
						{showPassword ? 'Hide password' : 'Show password'}
					</span>
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	)
}
