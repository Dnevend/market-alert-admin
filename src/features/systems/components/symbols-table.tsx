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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Power, PowerOff, Edit } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import type { TradingSymbol } from '../types'
import { useSymbols } from './symbols-provider'

export function SymbolsTable() {
  const { symbols, loading } = useSymbols()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [editingSymbol, setEditingSymbol] = React.useState<TradingSymbol | null>(null)
  const [editForm, setEditForm] = React.useState({
    symbol: '',
    threshold_percent: 0,
    cooldown_minutes: 0,
    webhook_url: '',
    enabled: true,
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({})

  const { updateSymbol, deleteSymbol } = useSymbols()

  const validateForm = (formData: typeof editForm): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (formData.threshold_percent <= 0 || formData.threshold_percent > 1) {
      errors.threshold_percent = 'Threshold must be between 0% and 100%'
    }

    if (formData.cooldown_minutes < 0) {
      errors.cooldown_minutes = 'Cooldown must be a positive number'
    }

    if (formData.webhook_url && !isValidUrl(formData.webhook_url)) {
      errors.webhook_url = 'Please enter a valid URL'
    }

    return errors
  }

  const isValidUrl = (string: string): boolean => {
    try {
      const url = new URL(string)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (_) {
      return false
    }
  }

  const handleToggleEnabled = async (symbol: TradingSymbol) => {
    try {
      await updateSymbol(symbol.symbol, { enabled: !symbol.enabled })
      toast.success(`Symbol ${symbol.symbol} has been ${!symbol.enabled ? 'enabled' : 'disabled'}.`)
    } catch (err) {
      console.error('Failed to toggle symbol:', err)
      toast.error("Failed to toggle symbol status. Please try again.")
    }
  }

  const handleDelete = async (symbol: TradingSymbol) => {
    try {
      await deleteSymbol(symbol.symbol)
      toast.success(`Symbol ${symbol.symbol} has been deleted.`)
    } catch (err) {
      console.error('Failed to delete symbol:', err)
      toast.error("Failed to delete symbol. Please try again.")
    }
  }

  const handleEdit = (symbol: TradingSymbol) => {
    setEditingSymbol(symbol)
    setEditForm({
      symbol: symbol.symbol,
      threshold_percent: symbol.threshold_percent,
      cooldown_minutes: symbol.cooldown_minutes,
      webhook_url: symbol.webhook_url || '',
      enabled: symbol.enabled,
    })
    setFormErrors({})
  }

  const handleSaveEdit = async () => {
    if (!editingSymbol) return

    // Validate form
    const errors = validateForm(editForm)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    setFormErrors({})

    try {
      await updateSymbol(editingSymbol.symbol, {
        threshold_percent: editForm.threshold_percent,
        cooldown_minutes: editForm.cooldown_minutes,
        webhook_url: editForm.webhook_url || null,
        enabled: editForm.enabled,
      })

      toast.success(`Symbol ${editingSymbol.symbol} has been updated successfully.`)

      setEditingSymbol(null)
      setFormErrors({})
    } catch (err) {
      console.error('Failed to update symbol:', err)

      // Handle different types of errors
      let errorMessage = "Failed to update symbol. Please try again."

      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again."
        } else if (err.message.includes('401') || err.message.includes('403')) {
          errorMessage = "Authentication error. Please log in again."
        } else if (err.message.includes('404')) {
          errorMessage = "Symbol not found or has been deleted."
        } else if (err.message.includes('409') || err.message.includes('conflict')) {
          errorMessage = "Symbol has been modified by another user. Please refresh and try again."
        }
      }

      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingSymbol(null)
    setFormErrors({})
    setEditForm({
      symbol: '',
      threshold_percent: 0,
      cooldown_minutes: 0,
      webhook_url: '',
      enabled: true,
    })
  }

  const columns: ColumnDef<TradingSymbol>[] = [
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
      accessorKey: 'enabled',
      header: 'Status',
      cell: ({ row }) => {
        const symbol = row.original
        return (
          <div className='flex items-center space-x-2'>
            <Switch
              checked={symbol.enabled}
              onCheckedChange={() => handleToggleEnabled(symbol)}
            />
            <Badge variant={symbol.enabled ? 'default' : 'secondary'}>
              {symbol.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: 'threshold_percent',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Threshold
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue('threshold_percent') as number
        return <div>{(value * 100).toFixed(2)}%</div>
      },
    },
    {
      accessorKey: 'cooldown_minutes',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cooldown
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue('cooldown_minutes') as number
        return <div>{value} min</div>
      },
    },
    {
      accessorKey: 'webhook_url',
      header: 'Webhook URL',
      cell: ({ row }) => {
        const url = row.getValue('webhook_url') as string
        return (
          <div className='max-w-xs truncate' title={url || undefined}>
            {url || 'No webhook'}
          </div>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const symbol = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(symbol.symbol)}
              >
                Copy symbol name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleEdit(symbol)}
                className='flex items-center space-x-2'
              >
                <Edit className='h-4 w-4' />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleToggleEnabled(symbol)}
                className='flex items-center space-x-2'
              >
                {symbol.enabled ? (
                  <>
                    <PowerOff className='h-4 w-4' />
                    <span>Disable</span>
                  </>
                ) : (
                  <>
                    <Power className='h-4 w-4' />
                    <span>Enable</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(symbol)}
                className='text-red-600'
              >
                Disable Symbol
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: symbols,
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

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-muted-foreground'>Loading symbols...</div>
      </div>
    )
  }

  return (
    <>
      <div className='w-full'>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter symbols...'
          value={(table.getColumn('symbol')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('symbol')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
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
      <Dialog open={!!editingSymbol} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Symbol</DialogTitle>
            <DialogDescription>
              Make changes to {editingSymbol?.symbol} here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="symbol" className="text-right">
                Symbol
              </Label>
              <Input
                id="symbol"
                value={editForm.symbol}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="threshold" className="text-right">
                Threshold (%)
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="threshold"
                  type="number"
                  step="0.01"
                  value={(editForm.threshold_percent * 100).toFixed(2)}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    threshold_percent: parseFloat(e.target.value) / 100
                  }))}
                  className={formErrors.threshold_percent ? "border-red-500" : ""}
                />
                {formErrors.threshold_percent && (
                  <p className="text-sm text-red-500">{formErrors.threshold_percent}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cooldown" className="text-right">
                Cooldown (min)
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="cooldown"
                  type="number"
                  value={editForm.cooldown_minutes}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    cooldown_minutes: parseInt(e.target.value) || 0
                  }))}
                  className={formErrors.cooldown_minutes ? "border-red-500" : ""}
                />
                {formErrors.cooldown_minutes && (
                  <p className="text-sm text-red-500">{formErrors.cooldown_minutes}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="webhook" className="text-right">
                Webhook URL
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="webhook"
                  type="url"
                  value={editForm.webhook_url}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    webhook_url: e.target.value
                  }))}
                  placeholder="https://example.com/webhook"
                  className={formErrors.webhook_url ? "border-red-500" : ""}
                />
                {formErrors.webhook_url && (
                  <p className="text-sm text-red-500">{formErrors.webhook_url}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="enabled" className="text-right">
                Enabled
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={editForm.enabled}
                  onCheckedChange={(checked) => setEditForm(prev => ({
                    ...prev,
                    enabled: checked
                  }))}
                />
                <Label htmlFor="enabled" className="text-sm font-normal">
                  {editForm.enabled ? 'Symbol is active' : 'Symbol is disabled'}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
