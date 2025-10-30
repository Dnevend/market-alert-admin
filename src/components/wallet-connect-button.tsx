import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogOut, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const [isSigning, setIsSigning] = useState(false)
  const { auth } = useAuthStore()
  const navigate = useNavigate()

  const handleConnect = async () => {
    // Prioritize browser extension wallets (MetaMask, etc.)
    const browserConnector = connectors.find(
      (c) => c.type === 'injected' || c.id === 'metaMask'
    )
    const preferredConnector = browserConnector || connectors[0]

    if (preferredConnector) {
      connect({ connector: preferredConnector })
    }
  }

  const handleSignInWithWallet = async () => {
    if (!address) return

    setIsSigning(true)
    try {
      // Create a message to sign
      const message = `Sign in to Market Alert Admin with wallet ${address}`

      // Sign the message
      const signature = await signMessageAsync({ message })

      // Mock backend verification and user creation
      // In a real app, you would send the signature and address to your backend
      // for verification and receive a JWT token back

      const mockUser = {
        accountNo: address,
        email: `${address}@wallet.user`, // Mock email based on wallet address
        role: ['user'],
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        walletAddress: address,
        signature: signature,
      }

      // Set user and access token
      auth.setUser(mockUser)
      auth.setAccessToken(`wallet-token-${signature.slice(0, 20)}`)

      toast.success('Successfully signed in with wallet!')
      navigate({ to: '/', replace: true })
    } catch {
      toast.error('Failed to sign in with wallet')
    } finally {
      setIsSigning(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    auth.reset()
    toast.success('Wallet disconnected')
  }

  if (isConnected && address) {
    return (
      <div className='flex items-center gap-2'>
        <Button
          onClick={handleSignInWithWallet}
          disabled={isSigning || !!auth.user}
          className='bg-green-600 hover:bg-green-700'
        >
          {isSigning ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Signing...
            </>
          ) : auth.user ? (
            'Connected'
          ) : (
            'Sign In with Wallet'
          )}
        </Button>
        <Button variant='outline' onClick={handleDisconnect}>
          <LogOut className='mr-2 h-4 w-4' />
          {address.slice(0, 6)}...{address.slice(-4)}
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleConnect} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className='mr-2 h-4 w-4' />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
