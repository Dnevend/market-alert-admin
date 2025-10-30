import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Systems } from '@/features/systems'

export const Route = createFileRoute('/_authenticated/systems')({
  component: () => (
    <div className='flex-1'>
      <Outlet />
    </div>
  ),
})