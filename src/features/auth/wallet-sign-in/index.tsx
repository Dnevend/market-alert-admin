import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Shield, Wallet } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
            Connect your crypto wallet to access the dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Secure Authentication
            </CardTitle>
            <CardDescription className='max-w-[350px]'>
              Sign in securely using your Web3 wallet. No password required.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='text-muted-foreground text-sm'>
              <p className='mb-2'>🔐 Your signature creates a secure session</p>
              <p className='mb-2'>🌐 No personal data stored</p>
              <p>
                💰 Support for popular wallets (MetaMask, WalletConnect, etc.)
              </p>
            </div>

            <div className='flex w-full justify-center'>
              <WalletConnectButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  )
}
