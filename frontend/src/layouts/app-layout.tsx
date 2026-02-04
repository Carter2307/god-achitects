import { Outlet, Navigate, NavLink, useNavigate } from 'react-router'
import { useAuth } from '@/contexts/auth-context'
import { PageLoader, Button } from '@/components/ui'
import { cn, getInitials, getRoleLabel } from '@/lib/utils'
import {
  LayoutDashboard,
  CalendarDays,
  History,
  Car,
  Users,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
  roles?: string[]
}

const navItems: NavItem[] = [
  {
    label: 'Tableau de bord',
    to: '/',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: 'Réservations',
    to: '/reservations',
    icon: <CalendarDays className="h-4 w-4" />,
  },
  {
    label: 'Historique',
    to: '/history',
    icon: <History className="h-4 w-4" />,
  },
  {
    label: 'Places de parking',
    to: '/parking-spots',
    icon: <Car className="h-4 w-4" />,
    roles: ['SECRETARY'],
  },
  {
    label: 'Utilisateurs',
    to: '/users',
    icon: <Users className="h-4 w-4" />,
    roles: ['SECRETARY'],
  },
]

export function AppLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user.role)
  )

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <span className="font-semibold text-foreground">Parking</span>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {getRoleLabel(user.role)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => navigate('/profile')}
              >
                <User className="mr-2 h-4 w-4" />
                Profil
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Quitter
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-14 items-center border-b border-border px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-4 font-semibold">Parking</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
