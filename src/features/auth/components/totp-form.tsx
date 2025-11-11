'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import CustomFormField, { FormFieldType } from '@/components/custom-form-field'
import { LoadingSwap } from '@/components/loading-swap'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth/auth-client'

const totpSchema = z.object({
	code: z.string().length(6),
})

type TotpForm = z.infer<typeof totpSchema>

export function TotpForm() {
	const router = useRouter()
	const form = useForm<TotpForm>({
		resolver: zodResolver(totpSchema),
		defaultValues: {
			code: '',
		},
	})

	const { isSubmitting } = form.formState

	async function handleTotpVerification(data: TotpForm) {
		await authClient.twoFactor.verifyTotp(data, {
			onError: (error) => {
				toast.error(error.error.message || 'Failed to verify code')
			},
			onSuccess: () => {
				router.push('/')
			},
		})
	}

	return (
		<Form {...form}>
			<form
				className="space-y-4"
				onSubmit={form.handleSubmit(handleTotpVerification)}
			>
				<CustomFormField
					fieldType={FormFieldType.INPUT}
					name="code"
					label="Code"
					variant="lg"
				/>

				<Button
					type="submit"
					disabled={isSubmitting}
					className="w-full"
					size="lg"
				>
					<LoadingSwap isLoading={isSubmitting}>Verify</LoadingSwap>
				</Button>
			</form>
		</Form>
	)
}
