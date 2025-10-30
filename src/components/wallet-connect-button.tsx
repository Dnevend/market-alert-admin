import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogOut, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { http } from '@/lib/http/axios'
import { ConnectKitButton } from 'connectkit'

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const [isSigning, setIsSigning] = useState(false)
  const [autoSigning, setAutoSigning] = useState(false)
  const [previousConnectionState, setPreviousConnectionState] = useState(false)
  const { auth } = useAuthStore()
  const navigate = useNavigate()

  const handleSignInWithWallet = useCallback(async () => {
    if (!address) {
      console.log('No address, returning')
      return
    }

    console.log('Starting wallet sign in process...')
    setIsSigning(true)
    try {
      // Step 1: Get sign message from backend
      console.log('Step 1: Getting sign message from backend...')
      const messageResponse = await http.get(`/auth/message?address=${address}`)

      if (!messageResponse.success) {
        throw new Error(messageResponse.error?.message || 'Failed to get sign message')
      }

      const messageData = messageResponse.data as { message: string; timestamp: number }
      const { message } = messageData
      console.log('Got message from backend')

      // Step 2: Sign the message
      console.log('Step 2: Requesting signature...')
      const signature = await signMessageAsync({ message })
      console.log('Message signed successfully')

      // Step 3: Verify signature with backend and get JWT token
      console.log('Step 3: Verifying signature with backend...')
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

      console.log('Signature verified successfully, setting user data...')

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

      console.log('User signed in successfully, navigating...')
      toast.success('🎉 Welcome! You have been signed in successfully.')
      navigate({ to: '/', replace: true })
    } catch (error) {
      console.error('Wallet sign in error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to sign in with wallet')
    } finally {
      console.log('Finally block: resetting signing states')
      setIsSigning(false)
      setAutoSigning(false)
    }
  }, [address, signMessageAsync, auth, navigate])

  // Track connection state changes for better UX
  useEffect(() => {
    if (isConnected !== previousConnectionState) {
      if (isConnected && !previousConnectionState) {
        console.log('Wallet just connected for the first time')
      }
      setPreviousConnectionState(isConnected)
    }
  }, [isConnected, previousConnectionState])

  // Dedicated auto-sign function with duplicate prevention
  const triggerAutoSignIn = useCallback(() => {
    console.log('🎯 triggerAutoSignIn called')
    console.log('Current state:', { isConnected, address: !!address, hasUser: !!auth.user, isSigning, autoSigning })

    // Prevent duplicate calls
    if (autoSigning || isSigning) {
      console.log('⚠️ Already signing in, skipping duplicate call')
      return
    }

    if (isConnected && address && !auth.user) {
      console.log('✅ All conditions met, triggering auto sign-in...')
      setAutoSigning(true)

      toast.info('Wallet connected! Signing you in automatically...')

      setTimeout(() => {
        console.log('🚀 Executing auto sign-in...')
        handleSignInWithWallet()
      }, 1000)
    } else {
      console.log('❌ Conditions not met for auto sign-in')
    }
  }, [isConnected, address, auth.user, isSigning, autoSigning, handleSignInWithWallet])

  // Single auto-trigger effect to prevent double requests
  useEffect(() => {
    console.log('🔄 Wallet state changed - checking for auto sign-in opportunity')

    // Only trigger if wallet is connected and we have an address
    if (isConnected && address) {
      console.log('🔗 Wallet connected, scheduling auto sign-in...')

      // Clear any existing auto-signing state first
      setAutoSigning(false)

      // Trigger auto sign-in with a delay to ensure all states are settled
      const timer = setTimeout(() => {
        triggerAutoSignIn()
      }, 1500) // 1.5 second delay for ConnectKit/wagmi state stabilization

      return () => clearTimeout(timer)
    }
  }, [isConnected, address, triggerAutoSignIn])

  const handleDisconnect = useCallback(() => {
    console.log('handleDisconnect called, resetting autoSigning')
    setAutoSigning(false)
    disconnect()
    auth.reset()
  }, [disconnect, auth])

  const handleManualSignIn = useCallback(() => {
    console.log('Manual sign-in requested, resetting autoSigning first')
    setAutoSigning(false)
    // Small delay to ensure state is reset before triggering sign in
    setTimeout(() => {
      handleSignInWithWallet()
    }, 100)
  }, [handleSignInWithWallet])

  // If wallet is connected but user is not signed in yet
  if (isConnected && address && !auth.user) {
    return (
      <div className='flex items-center gap-2'>
        <Button
          onClick={autoSigning ? handleManualSignIn : handleSignInWithWallet}
          disabled={isSigning}
          className='bg-green-600 hover:bg-green-700'
        >
          {(isSigning || autoSigning) ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              {isSigning ? 'Signing...' : 'Connecting...'}
            </>
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

  // If user is already signed in
  if (auth.user) {
    return (
      <div className='flex items-center gap-2'>
        <Button variant='outline' disabled>
          <Wallet className='mr-2 h-4 w-4' />
          Connected
        </Button>
        <Button variant='outline' onClick={handleDisconnect}>
          <LogOut className='mr-2 h-4 w-4' />
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Disconnect'}
        </Button>
      </div>
    )
  }

  // Show ConnectKit button for initial connection
  return <ConnectKitButton />
}
