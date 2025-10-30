import { createFileRoute } from '@tanstack/react-router'

import { Alerts } from '@/features/systems/alerts'

export const Route = createFileRoute('/_authenticated/systems/alerts')({
  component: Alerts,
})