import {
	adminClient,
	inferAdditionalFields,
	passkeyClient,
	twoFactorClient,
} from 'better-auth/client/plugins'
import { nextCookies } from 'better-auth/next-js'
import { createAuthClient } from 'better-auth/react'

import { auth } from './auth'
import {
	ac,
	admin,
	marketingManager,
	marketingRep,
	salesManager,
	salesRep,
	superAdmin,
	supportManager,
	supportRep,
	user,
} from './permissions'

export const authClient = createAuthClient({
	plugins: [
		inferAdditionalFields<typeof auth>(),
		passkeyClient(),
		twoFactorClient({
			onTwoFactorRedirect: () => {
				window.location.href = '/2fa'
			},
		}),
		adminClient({
			ac,
			roles: {
				superAdmin,
				admin,
				salesManager,
				salesRep,
				marketingManager,
				marketingRep,
				supportManager,
				supportRep,
				user,
			},
		}),
		nextCookies(),
	],
})
