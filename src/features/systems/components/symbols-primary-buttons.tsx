import { Button } from '@/components/ui/button'
import { RefreshCw, Play } from 'lucide-react'
import { useSymbols } from './symbols-provider'
import { adminApi } from '../api'

export function SymbolsPrimaryButtons() {
  const { refreshSymbols, loading } = useSymbols()

  const handleRefresh = async () => {
    await refreshSymbols()
  }

  const handleTriggerMonitoring = async () => {
    try {
      await adminApi.trigger()
      console.log('Monitoring triggered successfully')
    } catch (err) {
      console.error('Failed to trigger monitoring:', err)
    }
  }

  return (
    <div className='flex items-center space-x-2'>
      <Button
        variant='outline'
        onClick={handleRefresh}
        disabled={loading}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
      <Button
        variant='outline'
        onClick={handleTriggerMonitoring}
      >
        <Play className='mr-2 h-4 w-4' />
        Trigger Monitoring
      </Button>
    </div>
  )
}