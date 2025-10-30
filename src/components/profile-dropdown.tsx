import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { useAuthStore } from '@/stores/auth-store'
import { UserAPI, type UserProfile } from '@/services/user-api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const { auth } = useAuthStore()

  useEffect(() => {
    // Fetch user profile when component mounts and user is authenticated
    if (auth.user && auth.accessToken) {
      fetchProfile()
    }
  }, [auth.user, auth.accessToken])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const userProfile = await UserAPI.getProfile()
      setProfile(userProfile)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      // Don't show toast on every profile fetch failure, as it might be expected
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshProfile = async () => {
    await fetchProfile()
    toast.success('Profile refreshed')
  }

  // Display loading state
  if (loading) {
    return (
      <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </Button>
    )
  }

  // Get display info from either profile or auth store
  const displayName = profile?.nickname ||
    auth.user?.email?.split('@')[0] ||
    auth.user?.accountNo?.slice(0, 8) ||
    'User'

  const displayEmail = profile?.nickname
    ? `${profile.address.slice(0, 6)}...${profile.address.slice(-4)}`
    : auth.user?.email ||
    (auth.user?.accountNo && `${auth.user.accountNo.slice(0, 6)}...${auth.user.accountNo.slice(-4)}`) ||
    ''

  const avatarUrl = profile?.avatar_url || '/avatars/01.png'

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm leading-none font-medium'>{displayName}</p>
              <p className='text-muted-foreground text-xs leading-none'>
                {displayEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to='/settings/account'>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            {auth.user?.role?.includes('admin') && (
              <>
                <DropdownMenuItem asChild>
                  <Link to='/settings'>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRefreshProfile}>
                  Refresh Profile
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            Sign out
            <DropdownMenuShortcut className='text-current'>
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}