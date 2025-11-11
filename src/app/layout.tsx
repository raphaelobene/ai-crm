import type { Metadata } from 'next'

import './globals.css'

import { Toaster } from '@/components/ui/sonner'
import { site } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/providers/theme-provider'

export const metadata: Metadata = {
	description: site.description,
	metadataBase: new URL(site.url),
	openGraph: {
		description: site.description,
		images: [{ url: site.ogImage }],
		title: site.name,
		url: site.url,
	},
	title: {
		absolute: site.name,
		template: `%s | ${site.name}`,
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn('font-sans antialiased')}
				style={{ WebkitTapHighlightColor: 'transparent' }}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					disableTransitionOnChange
					enableSystem
				>
					{children}
					<Toaster position="top-center" visibleToasts={1} />
				</ThemeProvider>
			</body>
		</html>
	)
}
