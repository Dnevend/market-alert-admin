import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import type { CreateTradingSymbolRequest } from '../types'
import { useSymbols } from './symbols-provider'

export function SymbolsDialogs() {
  const { createSymbol } = useSymbols()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState<CreateTradingSymbolRequest>({
    symbol: '',
    enabled: true,
    threshold_percent: 0.05,
    cooldown_minutes: 60,
    webhook_url: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createSymbol(formData)
      setIsCreateDialogOpen(false)
      // Reset form
      setFormData({
        symbol: '',
        enabled: true,
        threshold_percent: 0.05,
        cooldown_minutes: 60,
        webhook_url: '',
      })
    } catch (err) {
      console.error('Failed to create symbol:', err)
    }
  }

  const handleInputChange = (field: keyof CreateTradingSymbolRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Add Symbol
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Symbol</DialogTitle>
              <DialogDescription>
                Add a new trading symbol to monitor. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='symbol' className='text-right'>
                  Symbol
                </Label>
                <Input
                  id='symbol'
                  placeholder='BTCUSDT'
                  value={formData.symbol}
                  onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                  className='col-span-3'
                  required
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='enabled' className='text-right'>
                  Enabled
                </Label>
                <div className='col-span-3 flex items-center space-x-2'>
                  <Switch
                    id='enabled'
                    checked={formData.enabled}
                    onCheckedChange={(checked) => handleInputChange('enabled', checked)}
                  />
                  <Label htmlFor='enabled' className='text-sm text-muted-foreground'>
                    {formData.enabled ? 'Monitoring active' : 'Monitoring paused'}
                  </Label>
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='threshold' className='text-right'>
                  Threshold
                </Label>
                <div className='col-span-3 flex items-center space-x-2'>
                  <Input
                    id='threshold'
                    type='number'
                    step='0.001'
                    min='0.001'
                    max='1.0'
                    value={formData.threshold_percent}
                    onChange={(e) => handleInputChange('threshold_percent', parseFloat(e.target.value))}
                    className='flex-1'
                    required
                  />
                  <span className='text-sm text-muted-foreground'>%</span>
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='cooldown' className='text-right'>
                  Cooldown
                </Label>
                <div className='col-span-3 flex items-center space-x-2'>
                  <Input
                    id='cooldown'
                    type='number'
                    min='1'
                    max='1440'
                    value={formData.cooldown_minutes}
                    onChange={(e) => handleInputChange('cooldown_minutes', parseInt(e.target.value))}
                    className='flex-1'
                    required
                  />
                  <span className='text-sm text-muted-foreground'>minutes</span>
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='webhook' className='text-right'>
                  Webhook URL
                </Label>
                <Textarea
                  id='webhook'
                  placeholder='https://example.com/webhook'
                  value={formData.webhook_url || ''}
                  onChange={(e) => handleInputChange('webhook_url', e.target.value || undefined)}
                  className='col-span-3'
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type='submit'>Create Symbol</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}