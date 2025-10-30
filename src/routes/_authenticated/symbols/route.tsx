import { createFileRoute } from '@tanstack/react-router'

import { Symbols } from '@/features/systems/symbols'

export const Route = createFileRoute('/_authenticated/symbols')({
  component: Symbols,
})