import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/systems')({
  component: () => (
    <div className='flex-1'>
      <Outlet />
    </div>
  ),
})