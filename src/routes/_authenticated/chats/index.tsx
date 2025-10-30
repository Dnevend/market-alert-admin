import { createFileRoute } from '@tanstack/react-router'
import { Chats } from '@/features/chats'
import { requireUser } from '@/lib/auth-guard'

export const Route = createFileRoute('/_authenticated/chats/')({
  beforeLoad: () => {
    requireUser()
  },
  component: Chats,
})
