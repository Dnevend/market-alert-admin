import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard'
import { requireGuest } from '@/lib/auth-guard'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    requireGuest()
  },
  component: Dashboard,
})
