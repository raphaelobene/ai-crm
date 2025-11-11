import { z } from 'zod'

const emailSchema = z
	.email({ message: 'Invalid email address', pattern: z.regexes.unicodeEmail })
	.trim()

const passwordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
	.regex(/[0-9]/, 'Password must contain at least one number')
	.refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
		message: 'Password must contain at least one special character',
	})

export const signinSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	rememberMe: z.boolean().optional(),
})

export const signupSchema = z.object({
	email: emailSchema,
	name: z.string().trim().min(2, {
		message: 'Name must be at least 2 characters',
	}),
	password: passwordSchema,
})

export const updatePasswordSchema = z
	.object({
		confirmPassword: passwordSchema,
		password: passwordSchema,
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords do not match!',
				path: ['confirmPassword'],
			})
		}
	})

export const forgotPasswordSchema = z.object({
	email: emailSchema,
})

// export const resetPasswordSchema = z.object({
//   token: z.string().min(1, { message: "Token is required" }),
//   password: passwordSchema,
// });

export const resetPasswordSchema = z
	.object({
		confirmPassword: z.string(),
		password: passwordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

export const verifyEmailSchema = z.object({
	email: emailSchema,
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type SigninInput = z.infer<typeof signinSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
export type VerificationEmailInput = z.infer<typeof verifyEmailSchema>
