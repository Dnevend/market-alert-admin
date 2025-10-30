import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { useAlerts } from './alerts-provider'

export function AlertsStats() {
  const { alerts } = useAlerts()
  const total = alerts.length
  const sent = alerts.filter(a => a.status === 'SENT').length
  const failed = alerts.filter(a => a.status === 'FAILED').length
  const skipped = alerts.filter(a => a.status === 'SKIPPED').length
  const upTrends = alerts.filter(a => a.direction === 'UP').length
  const downTrends = alerts.filter(a => a.direction === 'DOWN').length

  const stats = [
    {
      title: 'Total Alerts',
      value: total,
      icon: null,
      description: 'All time alerts',
    },
    {
      title: 'Sent Successfully',
      value: sent,
      icon: <CheckCircle className='h-4 w-4 text-green-600' />,
      description: `${((sent / total) * 100).toFixed(1)}% success rate`,
    },
    {
      title: 'Failed',
      value: failed,
      icon: <XCircle className='h-4 w-4 text-red-600' />,
      description: `${((failed / total) * 100).toFixed(1)}% failure rate`,
    },
    {
      title: 'Skipped',
      value: skipped,
      icon: <Clock className='h-4 w-4 text-yellow-600' />,
      description: `${((skipped / total) * 100).toFixed(1)}% skipped rate`,
    },
  ]

  const directionStats = [
    {
      title: 'Up Trends',
      value: upTrends,
      icon: <TrendingUp className='h-4 w-4 text-green-600' />,
      description: `${((upTrends / total) * 100).toFixed(1)}% of total`,
    },
    {
      title: 'Down Trends',
      value: downTrends,
      icon: <TrendingDown className='h-4 w-4 text-red-600' />,
      description: `${((downTrends / total) * 100).toFixed(1)}% of total`,
    },
  ]

  const getVariant = (value: number, total: number) => {
    if (total === 0) return 'outline'
    const percentage = (value / total) * 100
    if (percentage > 50) return 'default'
    if (percentage > 20) return 'secondary'
    return 'outline'
  }

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alert Statistics</CardTitle>
          <CardDescription>
            No alerts available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-center text-muted-foreground py-8'>
            No alert data available yet
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <p className='text-xs text-muted-foreground'>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Direction Analysis</CardTitle>
          <CardDescription>
            Market trend distribution from alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            {directionStats.map((stat) => (
              <div key={stat.title} className='flex items-center justify-between space-x-4'>
                <div className='flex items-center space-x-2'>
                  {stat.icon}
                  <span className='text-sm font-medium'>{stat.title}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <span className='text-lg font-bold'>{stat.value}</span>
                  <Badge variant={getVariant(stat.value, total)}>
                    {((stat.value / total) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}