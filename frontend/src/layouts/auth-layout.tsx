import { Outlet, Navigate } from 'react-router'
import { useAuth } from '@/contexts/auth-context'
import { PageLoader } from '@/components/ui'

export function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <PageLoader />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Parking Reservation</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Système de réservation de places de parking
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
