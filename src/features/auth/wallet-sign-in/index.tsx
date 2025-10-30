import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Wallet } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { WalletConnectButton } from '@/components/wallet-connect-button'
import { AuthLayout } from '@/features/auth/auth-layout'

export function WalletSignIn() {
  const { auth } = useAuthStore()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (auth.user) {
      navigate({ to: '/', replace: true })
    }
  }, [auth.user, navigate])

  return (
    <AuthLayout>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-fit'>
        <div className='flex flex-col space-y-2 text-center'>
          <div className='mb-4 flex items-center justify-center'>
            <Wallet className='mr-2 h-8 w-8' />
            <h1 className='text-2xl font-semibold tracking-tight'>
              Wallet Sign In
            </h1>
          </div>
          <p className='text-muted-foreground text-sm'>
            Connect your wallet to continue
          </p>
        </div>

        <div className='flex w-full justify-center'>
          <WalletConnectButton />
        </div>
      </div>
    </AuthLayout>
  )
}
