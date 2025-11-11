'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { Icons } from './icons'

interface BreadcrumbProps {
	className?: string
	currentPageText?: string
	showFullPath?: boolean
}

export default function Breadcrumb({
	className,
	currentPageText,
	showFullPath = false,
}: BreadcrumbProps) {
	const pathname = usePathname()
	const segments = pathname.split('/').filter(Boolean)

	const formatSegment = (segment: string): string => {
		return segment
			.replace(/-/g, ' ')
			.replace(/^\w/, (char) => char.toUpperCase())
	}

	const buildSegments = () => {
		if (segments.length === 0) return []

		// If not showing full path, only return the last segment
		if (!showFullPath) {
			const lastSegment = segments[segments.length - 1]
			return [
				{
					href: pathname,
					isLast: true,
					label: currentPageText || formatSegment(lastSegment),
				},
			]
		}

		// Build full path
		return segments.map((segment, index) => {
			const href = `/${segments.slice(0, index + 1).join('/')}`
			const isLast = index === segments.length - 1

			return {
				href,
				isLast,
				label:
					isLast && currentPageText ? currentPageText : formatSegment(segment),
			}
		})
	}

	const breadcrumbSegments = buildSegments()

	return (
		<ol className={cn('flex w-full items-start', className)}>
			{/* Home link */}
			{/* <li className="flex items-center">
        <Link
          href="/"
          className="text-sm/7 text-muted-foreground hover:text-foreground transition-colors"
        >
          Home
        </Link>
        {breadcrumbSegments.length > 0 && (
          <Icons.chevronRight className="mx-2 text-muted-foreground size-4 shrink-0" />
        )}
      </li> */}

			{/* Path segments */}
			{breadcrumbSegments.map((segment) => (
				<li className="flex items-center" key={segment.href}>
					{segment.isLast ? (
						<span className="text-sm/7 font-medium text-nowrap">
							{segment.label}
						</span>
					) : (
						<>
							<Link
								className="text-muted-foreground hover:text-foreground text-sm/7 transition-colors"
								href={segment.href}
							>
								{segment.label}
							</Link>
							<Icons.chevronRight className="text-muted-foreground mx-2 size-4 shrink-0" />
						</>
					)}
				</li>
			))}
		</ol>
	)
}
