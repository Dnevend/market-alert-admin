import { Button } from '@/components/ui/button'
import { RefreshCw, Download, Calendar } from 'lucide-react'
import { useAlerts } from './alerts-provider'

export function AlertsPrimaryButtons() {
  const { refreshAlerts, loading } = useAlerts()

  const handleRefresh = async () => {
    await refreshAlerts()
  }

  const handleExport = async () => {
    // TODO: Implement export functionality
    console.log('Export alerts')
  }

  const handleDateFilter = async () => {
    // TODO: Implement date filter
    console.log('Filter by date range')
  }

  return (
    <div className='flex items-center space-x-2'>
      <Button
        variant='outline'
        onClick={handleDateFilter}
      >
        <Calendar className='mr-2 h-4 w-4' />
        Date Range
      </Button>
      <Button
        variant='outline'
        onClick={handleExport}
      >
        <Download className='mr-2 h-4 w-4' />
        Export
      </Button>
      <Button
        variant='outline'
        onClick={handleRefresh}
        disabled={loading}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  )
}