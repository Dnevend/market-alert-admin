import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AlertsProvider } from './components/alerts-provider'
import { AlertsStats } from './components/alerts-stats'
import { AlertsPrimaryButtons } from './components/alerts-primary-buttons'
import { AlertsTable } from './components/alerts-table'

export function Alerts() {
  return (
    <AlertsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Alert History</h2>
            <p className='text-muted-foreground'>
              Monitor and analyze market alert history and performance.
            </p>
          </div>
          <AlertsPrimaryButtons />
        </div>

        <AlertsStats />
        <AlertsTable />
      </Main>
    </AlertsProvider>
  )
}