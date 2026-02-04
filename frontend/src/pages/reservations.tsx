import { useState } from 'react'
import { Link } from 'react-router'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useReservations, useCancelReservation, canCancelReservation } from '@/hooks'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Badge,
  Spinner,
} from '@/components/ui'
import { Plus, Calendar, Zap, X, AlertTriangle } from 'lucide-react'
import { getStatusLabel, cn } from '@/lib/utils'
import type { Reservation, ReservationStatus } from '@parking/api-client'

function getStatusVariant(status: ReservationStatus): 'success' | 'warning' | 'destructive' | 'secondary' {
  switch (status) {
    case 'CONFIRMED':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'CANCELLED':
      return 'destructive'
    case 'EXPIRED':
      return 'secondary'
    default:
      return 'secondary'
  }
}

interface CancelModalProps {
  reservation: Reservation
  onCancel: () => void
  onClose: () => void
  isLoading: boolean
}

function CancelModal({ reservation, onCancel, onClose, isLoading }: CancelModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
        <div className="flex items-center gap-3 text-warning">
          <AlertTriangle className="h-6 w-6" />
          <h3 className="text-lg font-semibold text-foreground">
            Annuler la réservation
          </h3>
        </div>
        <p className="mt-4 text-muted-foreground">
          Êtes-vous sûr de vouloir annuler la réservation de la place{' '}
          <span className="font-medium text-foreground">
            {reservation.parkingSpot?.spotNumber}
          </span>{' '}
          du{' '}
          <span className="font-medium text-foreground">
            {format(new Date(reservation.startDate), 'd MMM', { locale: fr })}
          </span>{' '}
          au{' '}
          <span className="font-medium text-foreground">
            {format(new Date(reservation.endDate), 'd MMM yyyy', { locale: fr })}
          </span>
          ?
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
            Non, garder
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onCancel}
            isLoading={isLoading}
          >
            Oui, annuler
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ReservationsPage() {
  const [cancellingReservation, setCancellingReservation] = useState<Reservation | null>(null)

  const { data, isLoading, isError, refetch } = useReservations()
  const cancelReservation = useCancelReservation()

  const handleCancelClick = (reservation: Reservation) => {
    setCancellingReservation(reservation)
  }

  const handleConfirmCancel = async () => {
    if (!cancellingReservation) return

    try {
      await cancelReservation.mutateAsync(cancellingReservation.id)
      setCancellingReservation(null)
    } catch {
      // Error handling is done in the mutation
    }
  }

  const reservations = data?.reservations || []

  // Sort reservations: active first, then by start date
  const sortedReservations = [...reservations].sort((a, b) => {
    const statusOrder = { CONFIRMED: 0, PENDING: 1, EXPIRED: 2, CANCELLED: 3 }
    const statusDiff =
      (statusOrder[a.status as keyof typeof statusOrder] || 4) -
      (statusOrder[b.status as keyof typeof statusOrder] || 4)
    if (statusDiff !== 0) return statusDiff
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Mes réservations</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez vos réservations de places de parking
          </p>
        </div>
        <Link
          to="/reservations/new"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle réservation
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-destructive/10 p-3">
              <X className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mt-4 font-medium text-foreground">
              Erreur de chargement
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Impossible de charger vos réservations
            </p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      ) : sortedReservations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium text-foreground">
              Aucune réservation
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Vous n'avez pas encore de réservation.
            </p>
            <Link
              to="/reservations/new"
              className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Réserver une place
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedReservations.map((reservation) => (
            <Card
              key={reservation.id}
              className={cn(
                reservation.status === 'CANCELLED' && 'opacity-60',
                reservation.status === 'EXPIRED' && 'opacity-60'
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    Place {reservation.parkingSpot?.spotNumber}
                    {reservation.parkingSpot?.hasElectricCharger && (
                      <Zap className="h-4 w-4 text-success" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    Rangée {reservation.parkingSpot?.row}
                  </CardDescription>
                </div>
                <Badge variant={getStatusVariant(reservation.status)}>
                  {getStatusLabel(reservation.status)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    <span>
                      Du{' '}
                      <span className="font-medium text-foreground">
                        {format(new Date(reservation.startDate), 'd MMMM yyyy', {
                          locale: fr,
                        })}
                      </span>
                    </span>
                    <span className="mx-2">→</span>
                    <span>
                      <span className="font-medium text-foreground">
                        {format(new Date(reservation.endDate), 'd MMMM yyyy', {
                          locale: fr,
                        })}
                      </span>
                    </span>
                  </div>
                  {canCancelReservation(reservation) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleCancelClick(reservation)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Annuler
                    </Button>
                  )}
                </div>
                {reservation.checkIn && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
                    <span className="font-medium">Check-in effectué</span>
                    <span>
                      le{' '}
                      {format(
                        new Date(reservation.checkIn.checkInTime),
                        'd MMM à HH:mm',
                        { locale: fr }
                      )}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {cancellingReservation && (
        <CancelModal
          reservation={cancellingReservation}
          onCancel={handleConfirmCancel}
          onClose={() => setCancellingReservation(null)}
          isLoading={cancelReservation.isPending}
        />
      )}
    </div>
  )
}
