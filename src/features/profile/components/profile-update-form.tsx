'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import CustomFormField, { FormFieldType } from '@/components/custom-form-field'
import { LoadingSwap } from '@/components/loading-swap'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth/auth-client'

const profileUpdateSchema = z.object({
	email: z.email().min(1),
	name: z.string().min(1),
})

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>

export function ProfileUpdateForm({
	user,
}: {
	user: {
		email: string
		name: string
	}
}) {
	const router = useRouter()
	const form = useForm<ProfileUpdateForm>({
		defaultValues: user,
		resolver: zodResolver(profileUpdateSchema),
	})

	const { isSubmitting } = form.formState

	async function handleProfileUpdate(data: ProfileUpdateForm) {
		const promises = [
			authClient.updateUser({
				name: data.name,
			}),
		]

		if (data.email !== user.email) {
			promises.push(
				authClient.changeEmail({
					callbackURL: '/profile',
					newEmail: data.email,
				})
			)
		}

		const res = await Promise.all(promises)

		const updateUserResult = res[0]
		const emailResult = res[1] ?? { error: false }

		if (updateUserResult.error) {
			toast.error(updateUserResult.error.message || 'Failed to update profile')
		} else if (emailResult.error) {
			toast.error(emailResult.error.message || 'Failed to change email')
		} else {
			if (data.email !== user.email) {
				toast.success('Verify your new email address to complete the change.')
			} else {
				toast.success('Profile updated successfully')
			}
			router.refresh()
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleProfileUpdate)}>
				<Card className="gap-4">
					<CardHeader>
						<CardTitle>Profile</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							label="Name"
							name="name"
							placeholder="Alan Turing"
							variant="sm"
						/>
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							label="Email"
							name="email"
							placeholder="alan.turing@example.com"
							type="email"
							variant="sm"
						/>
					</CardContent>
					<CardFooter className="border-t">
						<Button
							disabled={isSubmitting}
							size="sm"
							type="submit"
							variant="secondary"
						>
							<LoadingSwap isLoading={isSubmitting}>Update Profile</LoadingSwap>
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
