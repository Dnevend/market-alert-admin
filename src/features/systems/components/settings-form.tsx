import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Save, RefreshCw } from 'lucide-react'
import type { SystemSettings, UpdateSystemSettingsRequest } from '../types'
import { settingsApi } from '../api'

const defaultSettings: SystemSettings = {
  id: 1,
  default_threshold_percent: 0.02,
  window_minutes: 5,
  default_cooldown_minutes: 10,
  binance_base_url: 'https://api.binance.com',
  created_at: '2025-10-30T09:00:00.000Z',
  updated_at: '2025-10-30T11:30:00.000Z',
}

export function SettingsForm() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [formData, setFormData] = useState<UpdateSystemSettingsRequest>({
    default_threshold_percent: defaultSettings.default_threshold_percent,
    window_minutes: defaultSettings.window_minutes,
    default_cooldown_minutes: defaultSettings.default_cooldown_minutes,
    binance_base_url: defaultSettings.binance_base_url,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedSettings = await settingsApi.get()
      setSettings(fetchedSettings)
      setFormData({
        default_threshold_percent: fetchedSettings.default_threshold_percent,
        window_minutes: fetchedSettings.window_minutes,
        default_cooldown_minutes: fetchedSettings.default_cooldown_minutes,
        binance_base_url: fetchedSettings.binance_base_url,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings')
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const updatedSettings = await settingsApi.update(formData)
      setSettings(updatedSettings)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
      console.error('Failed to update settings:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof UpdateSystemSettingsRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSuccess(false)
  }

  const resetToDefaults = () => {
    setFormData({
      default_threshold_percent: defaultSettings.default_threshold_percent,
      window_minutes: defaultSettings.window_minutes,
      default_cooldown_minutes: defaultSettings.default_cooldown_minutes,
      binance_base_url: defaultSettings.binance_base_url,
    })
    setSuccess(false)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-medium'>System Settings</h3>
          <p className='text-sm text-muted-foreground'>
            Configure global monitoring system parameters
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            onClick={fetchSettings}
            disabled={loading || saving}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant='outline'
            onClick={resetToDefaults}
            disabled={saving}
          >
            Reset to Defaults
          </Button>
        </div>
      </div>

      {error && (
        <div className='rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
          {error}
        </div>
      )}

      {success && (
        <div className='rounded-md bg-green-50 p-3 text-sm text-green-800'>
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Default Parameters</CardTitle>
              <CardDescription>
                Default values applied to new trading symbols
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='threshold'>Default Threshold (%)</Label>
                <div className='flex items-center space-x-2'>
                  <Input
                    id='threshold'
                    type='number'
                    step='0.001'
                    min='0.001'
                    max='1.0'
                    value={formData.default_threshold_percent}
                    onChange={(e) => handleInputChange('default_threshold_percent', parseFloat(e.target.value))}
                    disabled={saving}
                  />
                  <Badge variant='secondary'>
                    {((formData.default_threshold_percent || 0) * 100).toFixed(2)}%
                  </Badge>
                </div>
                <p className='text-xs text-muted-foreground'>
                  Price change threshold to trigger alerts (0.1% - 100%)
                </p>
              </div>

              <Separator />

              <div className='space-y-2'>
                <Label htmlFor='cooldown'>Default Cooldown (minutes)</Label>
                <div className='flex items-center space-x-2'>
                  <Input
                    id='cooldown'
                    type='number'
                    min='1'
                    max='1440'
                    value={formData.default_cooldown_minutes}
                    onChange={(e) => handleInputChange('default_cooldown_minutes', parseInt(e.target.value))}
                    disabled={saving}
                  />
                  <Badge variant='secondary'>
                    {formData.default_cooldown_minutes} min
                  </Badge>
                </div>
                <p className='text-xs text-muted-foreground'>
                  Minimum time between alerts for the same symbol (1 - 1440 minutes)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monitoring Configuration</CardTitle>
              <CardDescription>
                System monitoring and API settings
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='window'>Monitoring Window (minutes)</Label>
                <div className='flex items-center space-x-2'>
                  <Input
                    id='window'
                    type='number'
                    min='1'
                    max='60'
                    value={formData.window_minutes}
                    onChange={(e) => handleInputChange('window_minutes', parseInt(e.target.value))}
                    disabled={saving}
                  />
                  <Badge variant='secondary'>
                    {formData.window_minutes} min
                  </Badge>
                </div>
                <p className='text-xs text-muted-foreground'>
                  Time window for price change calculations (1 - 60 minutes)
                </p>
              </div>

              <Separator />

              <div className='space-y-2'>
                <Label htmlFor='binance-url'>Binance API URL</Label>
                <Input
                  id='binance-url'
                  type='url'
                  placeholder='https://api.binance.com'
                  value={formData.binance_base_url}
                  onChange={(e) => handleInputChange('binance_base_url', e.target.value)}
                  disabled={saving}
                />
                <p className='text-xs text-muted-foreground'>
                  Base URL for Binance API calls
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='mt-6 flex justify-end'>
          <Button type='submit' disabled={saving}>
            {saving ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='mr-2 h-4 w-4' />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
          <CardDescription>
            Last updated: {new Date(settings.updated_at).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Default Threshold:</span>
              <span className='font-medium'>{(settings.default_threshold_percent * 100).toFixed(2)}%</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Window Minutes:</span>
              <span className='font-medium'>{settings.window_minutes} min</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Default Cooldown:</span>
              <span className='font-medium'>{settings.default_cooldown_minutes} min</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Binance URL:</span>
              <span className='font-medium truncate max-w-xs'>{settings.binance_base_url}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}