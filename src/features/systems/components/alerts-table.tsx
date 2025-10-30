import * as React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AlertHistory } from '../types'
import { useAlerts } from './alerts-provider'

export function AlertsTable() {
  const { alerts, loading } = useAlerts()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT':
        return <CheckCircle className='h-4 w-4 text-green-600' />
      case 'FAILED':
        return <XCircle className='h-4 w-4 text-red-600' />
      case 'SKIPPED':
        return <Clock className='h-4 w-4 text-yellow-600' />
      default:
        return <AlertCircle className='h-4 w-4 text-gray-600' />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      SENT: 'default',
      FAILED: 'destructive',
      SKIPPED: 'secondary',
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    )
  }

  const getDirectionIcon = (direction: string) => {
    return direction === 'UP' ? (
      <TrendingUp className='h-4 w-4 text-green-600' />
    ) : (
      <TrendingDown className='h-4 w-4 text-red-600' />
    )
  }

  const formatChangePercent = (value: number) => {
    const absValue = Math.abs(value)
    const sign = value >= 0 ? '+' : '-'
    return `${sign}${(absValue * 100).toFixed(3)}%`
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const columns: ColumnDef<AlertHistory>[] = [
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Time
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue('created_at') as string
        return <div className='text-sm'>{new Date(value).toLocaleString()}</div>
      },
    },
    {
      accessorKey: 'symbol',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Symbol
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='font-medium'>{row.getValue('symbol')}</div>
      ),
    },
    {
      accessorKey: 'change_percent',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Change
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const alert = row.original
        const value = alert.change_percent
        return (
          <div className='flex items-center space-x-2'>
            {getDirectionIcon(alert.direction)}
            <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatChangePercent(value)}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <div className='flex items-center space-x-2'>
            {getStatusIcon(status)}
            {getStatusBadge(status)}
          </div>
        )
      },
    },
    {
      accessorKey: 'window_start',
      header: 'Window',
      cell: ({ row }) => {
        const alert = row.original
        return (
          <div className='text-muted-foreground text-sm'>
            {formatTimestamp(alert.window_start)} -{' '}
            {formatTimestamp(alert.window_end)}
          </div>
        )
      },
    },
    {
      accessorKey: 'response_code',
      header: 'Response',
      cell: ({ row }) => {
        const alert = row.original
        if (alert.status === 'SKIPPED') {
          return <span className='text-muted-foreground'>-</span>
        }
        return (
          <div className='text-sm'>
            {alert.response_code ? (
              <Badge
                variant={alert.response_code >= 400 ? 'destructive' : 'default'}
              >
                {alert.response_code}
              </Badge>
            ) : (
              '-'
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'idempotency_key',
      header: 'ID',
      cell: ({ row }) => {
        const value = row.getValue('idempotency_key') as string
        return (
          <div className='max-w-xs truncate font-mono text-xs' title={value}>
            {value}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: alerts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'SENT', label: 'Sent' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'SKIPPED', label: 'Skipped' },
  ]

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-muted-foreground'>Loading alerts...</div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center gap-4 py-4'>
        <div className='flex items-center space-x-2'>
          <Input
            placeholder='Filter symbols...'
            value={
              (table.getColumn('symbol')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('symbol')?.setFilterValue(event.target.value)
            }
            className='w-[200px]'
          />
        </div>
        <div className='flex items-center space-x-2'>
          <Select
            value={
              (table.getColumn('status')?.getFilterValue() as string) ?? 'all'
            }
            onValueChange={(value) => {
              if (value === 'all') {
                table.getColumn('status')?.setFilterValue(undefined)
              } else {
                table.getColumn('status')?.setFilterValue(value)
              }
            }}
          >
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
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

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No alerts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='text-muted-foreground flex-1 text-sm'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
