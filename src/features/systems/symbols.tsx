import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SymbolsDialogs } from './components/symbols-dialogs'
import { SymbolsPrimaryButtons } from './components/symbols-primary-buttons'
import { SymbolsProvider } from './components/symbols-provider'
import { SymbolsTable } from './components/symbols-table'

export function Symbols() {
  return (
    <SymbolsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Trading Symbols</h2>
            <p className='text-muted-foreground'>
              Manage trading symbols monitoring configurations.
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <SymbolsPrimaryButtons />
            <SymbolsDialogs />
          </div>
        </div>
        <SymbolsTable />
      </Main>
    </SymbolsProvider>
  )
}