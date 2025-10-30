import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  TrendingUp,
} from 'lucide-react'
import { type SidebarData } from '../types'
import { Permission } from '@/lib/permissions'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      permissions: [Permission.DASHBOARD_VIEW], // 至少需要仪表盘查看权限才能看到这个组
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
          permissions: [Permission.DASHBOARD_VIEW],
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ListTodo,
          permissions: [Permission.TASKS_VIEW],
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: Package,
          permissions: [Permission.APPS_VIEW],
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
          permissions: [Permission.CHATS_VIEW],
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
          permissions: [Permission.USERS_VIEW],
        },
        {
          title: 'Symbols',
          url: '/symbols',
          icon: TrendingUp,
          permissions: [Permission.SYMBOLS_VIEW],
        },
        {
          title: 'Alerts',
          url: '/alerts',
          icon: Bell,
          permissions: [Permission.ALERTS_VIEW],
        },
        {
          title: 'System Settings',
          url: '/system-settings',
          icon: Settings,
          permissions: [Permission.SYSTEM_SETTINGS_VIEW],
        },
        {
          title: 'Permissions Test',
          url: '/permissions-test',
          icon: Settings,
          // 不设置权限，所有角色都可以访问权限测试页面
        },
      ],
    },
    {
      title: 'Pages',
      permissions: [Permission.ERRORS_VIEW], // 只有有错误页面权限的用户才能看到
      items: [
        {
          title: 'Errors',
          icon: Bug,
          permissions: [Permission.ERRORS_VIEW],
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
              permissions: [Permission.ERRORS_VIEW],
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
              permissions: [Permission.ERRORS_VIEW],
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
              permissions: [Permission.ERRORS_VIEW],
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
              permissions: [Permission.ERRORS_VIEW],
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
              permissions: [Permission.ERRORS_VIEW],
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
              permissions: [Permission.SETTINGS_PROFILE],
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
              permissions: [Permission.SETTINGS_ACCOUNT],
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
              permissions: [Permission.SETTINGS_APPEARANCE],
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
              permissions: [Permission.SETTINGS_NOTIFICATIONS],
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
              permissions: [Permission.SETTINGS_DISPLAY],
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
          permissions: [Permission.HELP_VIEW],
        },
      ],
    },
  ],
}
