import { createFileRoute } from '@tanstack/react-router'

import { Symbols } from '@/features/systems/symbols'

export const Route = createFileRoute('/_authenticated/systems/symbols')({
  component: Symbols,
})