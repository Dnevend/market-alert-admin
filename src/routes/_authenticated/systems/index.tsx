import { createFileRoute } from '@tanstack/react-router'

import { Systems } from '@/features/systems'

export const Route = createFileRoute('/_authenticated/systems/')({
  component: Systems,
})