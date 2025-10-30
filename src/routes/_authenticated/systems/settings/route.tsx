import { createFileRoute } from '@tanstack/react-router'

import { Settings } from '@/features/systems/settings'

export const Route = createFileRoute('/_authenticated/systems/settings')({
  component: Settings,
})