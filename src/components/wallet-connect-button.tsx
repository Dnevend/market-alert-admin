import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogOut, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { http } from '@/lib/http/axios'

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const [isSigning, setIsSigning] = useState(false)
  const { auth } = useAuthStore()
  const navigate = useNavigate()

  const handleConnect = async () => {
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
      // Step 1: Get sign message from backend
      const messageResponse = await http.get(`/auth/message?address=${address}`)

      if (!messageResponse.success) {
        throw new Error(messageResponse.error?.message || 'Failed to get sign message')
      }

      const messageData = messageResponse.data as { message: string; timestamp: number }
      const { message } = messageData

      // Step 2: Sign the message
      const signature = await signMessageAsync({ message })

      // Step 3: Verify signature with backend and get JWT token
      const verifyResponse = await http.post('/auth/verify', {
        address,
        signature,
      })

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.error?.message || 'Failed to verify signature')
      }

      const { token, address: verifiedAddress, role, expiresIn } = verifyResponse.data as {
        token: string
        address: string
        role: string
        expiresIn: number
      }

      // Calculate expiration timestamp
      const exp = Date.now() + (expiresIn * 1000) // Convert seconds to milliseconds

      // Create user object matching our store interface
      const user = {
        accountNo: verifiedAddress,
        email: `${verifiedAddress}@wallet.user`, // Generate email from address
        role: [role], // Backend returns role as string, convert to array
        exp: exp,
        walletAddress: verifiedAddress,
        signature: signature,
      }

      // Set user and access token in store
      auth.setUser(user)
      auth.setAccessToken(token)

      toast.success('Successfully signed in with wallet!')
      navigate({ to: '/', replace: true })
    } catch (error) {
      console.error('Wallet sign in error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to sign in with wallet')
    } finally {
      setIsSigning(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    auth.reset()
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
            'Sign In'
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
