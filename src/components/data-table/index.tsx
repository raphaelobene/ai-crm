'use client'

import * as React from 'react'
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'

const DEFAULT_REACT_TABLE_COLUMN_WIDTH = 150

interface DataTableProps<TData, TValue> {
	columns:
		| ColumnDef<TData, TValue>[]
		| ((searchTerm: string) => ColumnDef<TData, TValue>[])
	data: TData[]
	searchKey?: string
	searchPlaceholder?: string
	noResultPlaceholder?: string
	showTableHeader?: boolean
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey = '',
	searchPlaceholder = 'Search...',
	noResultPlaceholder = 'No results',
	showTableHeader,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	})

	const searchTerm = React.useMemo(() => {
		const searchFilter = columnFilters.find((filter) => filter.id === searchKey)
		return (searchFilter?.value as string) || ''
	}, [columnFilters, searchKey])

	const resolvedColumns = React.useMemo(() => {
		return typeof columns === 'function' ? columns(searchTerm) : columns
	}, [columns, searchTerm])

	const table = useReactTable({
		columns: resolvedColumns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		state: {
			columnFilters,
			columnVisibility,
			rowSelection,
			sorting,
			pagination,
		},
	})

	return (
		<div className="space-y-4">
			{showTableHeader && (
				<div className="flex items-center justify-between gap-4">
					<InputGroup className="border-border bg-muted dark:bg-muted/50 h-8 max-w-sm">
						<InputGroupInput
							className="h-8"
							onChange={(event) =>
								table.getColumn(searchKey)?.setFilterValue(event.target.value)
							}
							placeholder={searchPlaceholder}
							value={
								(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
							}
						/>
						<InputGroupAddon>
							<Icons.search className="stroke-2" />
						</InputGroupAddon>
					</InputGroup>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="bg-muted not-disabled:hover:bg-muted dark:text-muted-foreground not-disabled:hover:text-foreground dark:not-disabled:hover:text-muted-foreground dark:bg-muted/50 dark:not-disabled:hover:bg-muted/60 ml-auto font-normal"
								variant="outline"
								size="sm"
							>
								<Icons.settings className="text-muted-foreground!" />
								View
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											checked={column.getIsVisible()}
											className="capitalize"
											key={column.id}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									)
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)}

			<Table className="border-separate border-spacing-0">
				{showTableHeader && table.getHeaderGroups() && (
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="hover:bg-transparent">
								{headerGroup.headers.map((header) => {
									const styles: React.CSSProperties =
										header.getSize() !== DEFAULT_REACT_TABLE_COLUMN_WIDTH
											? { width: `${header.getSize()}px` }
											: {}
									return (
										<TableHead
											key={header.id}
											className="text-muted-foreground bg-muted dark:bg-muted/50 h-8 border-t border-b text-xs font-semibold first:rounded-l-xl first:border-l last:rounded-r-xl last:border-r"
											style={styles}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
				)}
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && 'selected'}
								className="hover:bg-transparent"
							>
								{row.getVisibleCells().map((cell) => {
									const styles: React.CSSProperties =
										cell.column.getSize() !== DEFAULT_REACT_TABLE_COLUMN_WIDTH
											? { width: `${cell.column.getSize()}px` }
											: {}

									return (
										<TableCell
											key={cell.id}
											className="border-b"
											style={styles}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									)
								})}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell className="h-12 text-center" colSpan={columns.length}>
								{noResultPlaceholder}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{showTableHeader && (
				<div className="flex items-center justify-end space-x-2 px-3 py-1">
					<div className="text-muted-foreground flex-1 text-sm">
						{table.getFilteredSelectedRowModel().rows.length} of{' '}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className="flex items-center gap-4">
						<Select
							value={String(table.getState().pagination.pageSize)}
							onValueChange={(value) => table.setPageSize(Number(value))}
						>
							<SelectTrigger size="sm">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={String(pageSize)}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<div className="space-x-2">
							<Button
								disabled={!table.getCanPreviousPage()}
								onClick={() => table.previousPage()}
								size="sm"
								variant="outline"
							>
								Previous
							</Button>
							<Button
								disabled={!table.getCanNextPage()}
								onClick={() => table.nextPage()}
								size="sm"
								variant="outline"
							>
								Next
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
