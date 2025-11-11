'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth/auth-client'

export default function useRedirect() {
	const router = useRouter()

	useEffect(() => {
		let isMounted = true

		const checkSession = async () => {
			try {
				const session = await authClient.getSession()
				if (isMounted && session?.data) {
					router.push('/')
				}
			} catch (error) {
				console.error('Error checking session:', error)
			}
		}

		checkSession()

		return () => {
			isMounted = false
		}
	}, [router])
}
