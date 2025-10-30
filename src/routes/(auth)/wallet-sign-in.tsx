import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { WalletSignIn } from '@/features/auth/wallet-sign-in'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/wallet-sign-in')({
  component: WalletSignIn,
  validateSearch: searchSchema,
})