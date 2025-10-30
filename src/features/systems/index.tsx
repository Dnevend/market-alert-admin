import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Bell, Settings, ArrowRight } from 'lucide-react'

export function Systems() {
  const systemSections = [
    {
      title: 'Trading Symbols',
      description: 'Configure and manage trading symbols monitoring settings',
      icon: TrendingUp,
      href: '/systems/symbols',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Alert History',
      description: 'View and analyze market alerts and performance metrics',
      icon: Bell,
      href: '/systems/alerts',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'System Settings',
      description: 'Configure global system parameters and defaults',
      icon: Settings,
      href: '/systems/settings',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h2 className='text-2xl font-bold tracking-tight'>Systems Management</h2>
        <p className='text-muted-foreground'>
          Monitor and manage the market alert system configuration and performance.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {systemSections.map((section) => (
          <Link key={section.title} to={section.href}>
            <Card className='group cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]'>
              <CardHeader className='space-y-3'>
                <div className={`w-12 h-12 rounded-lg ${section.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <section.icon className={`h-6 w-6 ${section.color}`} />
                </div>
                <div>
                  <CardTitle className='flex items-center justify-between group-hover:text-primary transition-colors'>
                    {section.title}
                    <ArrowRight className='h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity' />
                  </CardTitle>
                  <CardDescription className='mt-1'>
                    {section.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant='outline' className='w-full justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors'>
                  Manage {section.title.toLowerCase()}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>
            Quick system status and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Active Symbols</span>
                <Badge variant='default'>12</Badge>
              </div>
              <div className='text-xs text-muted-foreground'>
                Trading symbols currently being monitored
              </div>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Alerts Today</span>
                <Badge variant='secondary'>8</Badge>
              </div>
              <div className='text-xs text-muted-foreground'>
                Market alerts generated in the last 24 hours
              </div>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Success Rate</span>
                <Badge variant='outline'>94.2%</Badge>
              </div>
              <div className='text-xs text-muted-foreground'>
                Alert delivery success rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
