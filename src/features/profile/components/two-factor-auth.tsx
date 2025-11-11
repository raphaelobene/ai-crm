'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import z from 'zod'

import CustomFormField, { FormFieldType } from '@/components/custom-form-field'
import { LoadingSwap } from '@/components/loading-swap'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth/auth-client'
import { cn } from '@/lib/utils'

const twoFactorAuthSchema = z.object({
	password: z.string().min(1),
})

type TwoFactorAuthForm = z.infer<typeof twoFactorAuthSchema>
type TwoFactorData = {
	backupCodes: string[]
	totpURI: string
}

export function TwoFactorAuth({ isEnabled }: { isEnabled: boolean }) {
	const [twoFactorData, setTwoFactorData] = useState<null | TwoFactorData>(null)
	const router = useRouter()
	const form = useForm<TwoFactorAuthForm>({
		defaultValues: { password: '' },
		resolver: zodResolver(twoFactorAuthSchema),
	})

	const { isSubmitting } = form.formState

	async function handleDisableTwoFactorAuth(data: TwoFactorAuthForm) {
		await authClient.twoFactor.disable(
			{
				password: data.password,
			},
			{
				onError: (error) => {
					toast.error(error.error.message || 'Failed to disable 2FA')
				},
				onSuccess: () => {
					form.reset()
					router.refresh()
				},
			}
		)
	}

	async function handleEnableTwoFactorAuth(data: TwoFactorAuthForm) {
		const result = await authClient.twoFactor.enable({
			password: data.password,
		})

		if (result.error) {
			toast.error(result.error.message || 'Failed to enable 2FA')
		}
		{
			setTwoFactorData(result.data)
			form.reset()
		}
	}

	if (twoFactorData != null) {
		return (
			<QRCodeVerify
				{...twoFactorData}
				onDone={() => {
					setTwoFactorData(null)
				}}
			/>
		)
	}

	return (
		<Form {...form}>
			<form
				className="space-y-4"
				onSubmit={form.handleSubmit(
					isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth
				)}
			>
				<CustomFormField
					fieldType={FormFieldType.PASSWORD_INPUT}
					label="Password"
					name="password"
					placeholder="••••••••"
					variant="sm"
				/>

				<Button
					className={cn({
						'bg-destructive/20 text-destructive hover:bg-destructive/30':
							isEnabled,
					})}
					disabled={isSubmitting}
					type="submit"
					variant="secondary"
					size="sm"
				>
					<LoadingSwap isLoading={isSubmitting}>
						{isEnabled ? 'Disable 2FA' : 'Enable 2FA'}
					</LoadingSwap>
				</Button>
			</form>
		</Form>
	)
}

const qrSchema = z.object({
	token: z.string().length(6),
})

type QrForm = z.infer<typeof qrSchema>

function QRCodeVerify({
	backupCodes,
	onDone,
	totpURI,
}: TwoFactorData & { onDone: () => void }) {
	const [successfullyEnabled, setSuccessfullyEnabled] = useState(false)
	const router = useRouter()
	const form = useForm<QrForm>({
		defaultValues: { token: '' },
		resolver: zodResolver(qrSchema),
	})

	const { isSubmitting } = form.formState

	async function handleQrCode(data: QrForm) {
		await authClient.twoFactor.verifyTotp(
			{
				code: data.token,
			},
			{
				onError: (error) => {
					toast.error(error.error.message || 'Failed to verify code')
				},
				onSuccess: () => {
					setSuccessfullyEnabled(true)
					router.refresh()
				},
			}
		)
	}

	if (successfullyEnabled) {
		return (
			<>
				<p className="text-muted-foreground mb-2 text-sm">
					Save these backup codes in a safe place. You can use them to access
					your account.
				</p>
				<div className="mb-4 grid grid-cols-2 gap-2">
					{backupCodes.map((code, index) => (
						<div className="font-mono text-sm" key={index}>
							{code}
						</div>
					))}
				</div>
				<Button onClick={onDone} variant="outline">
					Done
				</Button>
			</>
		)
	}

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground">
				Scan this QR code with your authenticator app and enter the code below:
			</p>

			<Form {...form}>
				<form className="space-y-4" onSubmit={form.handleSubmit(handleQrCode)}>
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						label="Code"
						name="token"
						placeholder="XXXXXX"
					/>

					<Button className="w-full" disabled={isSubmitting} type="submit">
						<LoadingSwap isLoading={isSubmitting}>Submit Code</LoadingSwap>
					</Button>
				</form>
			</Form>
			<div className="w-fit bg-white p-4">
				<QRCode size={128} value={totpURI} />
			</div>
		</div>
	)
}
