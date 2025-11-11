import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: 'lh3.googleusercontent.com',
				pathname: '/a/**',
				protocol: 'https',
			},
			{
				hostname: 'avatars.githubusercontent.com',
				pathname: '/u/**',
				protocol: 'https',
			},
		],
	},
	reactStrictMode: true,
	typedRoutes: true,
}

export default nextConfig
