import * as React from 'react'
import { Column } from '@tanstack/react-table'

import { Icons } from '../icons'
import { Button } from '../ui/button'

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

export default function DataTableColumnHeader<TData, TValue>({
	className,
	column,
	title,
}: DataTableColumnHeaderProps<TData, TValue>) {
	const renderSortIcon = () => {
		const sort = column.getIsSorted()
		if (!sort) {
			return <Icons.chevronsUpDown className="size-4" />
		}
		return sort === 'desc' ? (
			<Icons.arrowDown className="size-4" />
		) : (
			<Icons.arrowUp className="size-4" />
		)
	}

	if (!column.getCanSort()) {
		return <div className={className}>{title}</div>
	}

	return (
		<div className={className}>
			<Button
				className="h-8 gap-2 px-0 hover:bg-transparent"
				onClick={column.getToggleSortingHandler()}
				size="sm"
				variant="ghost"
			>
				<span>{title}</span>
				{renderSortIcon()}
			</Button>
		</div>
	)
}
