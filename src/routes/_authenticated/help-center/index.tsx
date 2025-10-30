import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'
import { requireUser } from '@/lib/auth-guard'

export const Route = createFileRoute('/_authenticated/help-center/')({
  beforeLoad: () => {
    requireUser()
  },
  component: ComingSoon,
})
