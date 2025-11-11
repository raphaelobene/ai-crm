'use client'

import React from 'react'

interface ClientOnlyProps {
	children: React.ReactNode
}

const emptySubscribe = () => () => {}

export default function ClientOnly({ children }: ClientOnlyProps) {
	const isServer = React.useSyncExternalStore(
		emptySubscribe,
		() => false,
		() => true
	)

	return isServer ? null : children
}
