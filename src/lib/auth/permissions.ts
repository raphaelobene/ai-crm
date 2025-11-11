import { createAccessControl } from 'better-auth/plugins/access'
import {
	adminAc,
	defaultStatements,
	userAc,
} from 'better-auth/plugins/admin/access'

const statement = {
	...defaultStatements,
	deal: ['create', 'update', 'delete', 'read'],
	company: ['create', 'update', 'delete', 'read'],
	contact: ['create', 'update', 'delete', 'read'],
	activity: ['create', 'update', 'delete', 'read'],
	report: ['create', 'update', 'delete', 'read'],
	system: ['configure'],
	audit: ['read'],
} as const

export const ac = createAccessControl(statement)

export const superAdmin = ac.newRole({
	...adminAc.statements,
	deal: [...statement.deal],
	company: [...statement.company],
	contact: [...statement.contact],
	activity: [...statement.activity],
	report: [...statement.report],
	system: [...statement.system],
	audit: [...statement.audit],
})

export const admin = ac.newRole({
	...userAc.statements,
	user: [...adminAc.statements.user.filter((action) => action !== 'delete')],
	deal: [...statement.deal],
	company: [...statement.company],
	contact: [...statement.contact],
	activity: [...statement.activity],
	report: [...statement.report],
})

export const salesManager = ac.newRole({
	deal: [...statement.deal],
	activity: [...statement.activity],
	company: [...statement.company.filter((action) => action !== 'delete')],
	contact: [...statement.contact.filter((action) => action !== 'delete')],
	report: [...statement.report.filter((action) => action !== 'delete')],
})

export const salesRep = ac.newRole({
	activity: [...statement.activity],
	deal: [...statement.deal.filter((action) => action !== 'delete')],
	company: [...statement.company.filter((action) => action !== 'delete')],
	contact: [...statement.contact.filter((action) => action !== 'delete')],
	report: ['read'],
})

export const marketingManager = ac.newRole({
	company: ['read', 'update'],
	contact: [...statement.contact.filter((action) => action !== 'delete')],
	activity: [...statement.activity.filter((action) => action !== 'delete')],
	report: [...statement.report.filter((action) => action !== 'delete')],
})

export const marketingRep = ac.newRole({
	company: ['read'],
	contact: [...statement.contact.filter((action) => action !== 'delete')],
	activity: [...statement.activity.filter((action) => action !== 'delete')],
	report: ['read'],
})

export const supportManager = ac.newRole({
	company: ['read', 'update'],
	contact: ['read', 'update'],
	activity: [...statement.activity],
	report: ['read'],
})

export const supportRep = ac.newRole({
	company: ['read'],
	contact: ['read', 'update'],
	activity: [...statement.activity.filter((action) => action !== 'delete')],
})

export const user = ac.newRole({
	deal: ['read'],
})
