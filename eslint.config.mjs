import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import boundaries from 'eslint-plugin-boundaries'
import unusedImports from 'eslint-plugin-unused-imports'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
})

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		ignores: [
			'node_modules/**',
			'.next/**',
			'out/**',
			'build/**',
			'next-env.d.ts',
		],
		plugins: { boundaries, unusedImports },
		rules: {
			'boundaries/element-types': [
				'error',
				{
					default: 'disallow',
					rules: [
						{
							allow: ['shared'],
							from: ['shared'],
						},
						{
							allow: [
								'shared',
								['feature', { featureName: '${from.featureName}' }],
							],
							from: ['feature'],
						},
						{
							allow: ['shared', 'feature'],
							from: ['app', 'neverImport'],
						},
						{
							allow: [['app', { fileName: '*.css' }]],
							from: ['app'],
						},
					],
				},
			],
			'boundaries/no-unknown': ['error'],
			'boundaries/no-unknown-files': ['error'],
			'no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
		},
		settings: {
			'boundaries/elements': [
				{
					mode: 'full',
					pattern: [
						'src/components/**/*',
						'src/generated/**/*',
						'src/hooks/**/*',
						'src/lib/**/*',
						'src/providers/**/*',
					],
					type: 'shared',
				},
				{
					capture: ['featureName'],
					mode: 'full',
					pattern: ['src/features/*/**/*'],
					type: 'feature',
				},
				{
					capture: ['_', 'fileName'],
					mode: 'full',
					pattern: ['src/app/**/*'],
					type: 'app',
				},
				{
					mode: 'full',
					pattern: ['src/*', 'src/types/**/*'],
					type: 'neverImport',
				},
			],
			'boundaries/include': ['src/**/*'],
		},
	},
]

export default eslintConfig
