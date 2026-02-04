import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  format,
  addDays,
  startOfDay,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  isAfter,
  startOfMonth,
  endOfMonth,
  getDay,
  addMonths,
  subMonths,
  isWeekend,
  differenceInCalendarDays,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { useAvailableParkingSpots, useCreateReservation } from '@/hooks'
import { useAuth } from '@/contexts/auth-context'
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
import {
  Car,
  Zap,
  Calendar,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ParkingSpot } from '@parking/api-client'

type Step = 1 | 2 | 3

interface StepperProps {
  currentStep: Step
}

function Stepper({ currentStep }: StepperProps) {
  const steps = [
    { number: 1, label: 'Dates' },
    { number: 2, label: 'Place' },
    { number: 3, label: 'Confirmation' },
  ]

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
              currentStep > step.number
                ? 'bg-primary text-primary-foreground'
                : currentStep === step.number
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
            )}
          >
            {currentStep > step.number ? (
              <Check className="h-4 w-4" />
            ) : (
              step.number
            )}
          </div>
          <span
            className={cn(
              'ml-2 hidden text-sm font-medium sm:block',
              currentStep >= step.number
                ? 'text-foreground'
                : 'text-muted-foreground'
            )}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'mx-4 h-px w-8 sm:w-12',
                currentStep > step.number ? 'bg-primary' : 'bg-border'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

interface CalendarProps {
  startDate: Date | null
  endDate: Date | null
  onSelectDate: (date: Date) => void
  minDate: Date
}

function CalendarPicker({ startDate, endDate, onSelectDate, minDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(minDate))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of week the month starts on (0 = Sunday)
  const startDay = getDay(monthStart)
  // Adjust for Monday start (French calendar)
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false
    return isAfter(date, startDate) && isBefore(date, endDate)
  }

  const isSelected = (date: Date) => {
    if (startDate && isSameDay(date, startDate)) return true
    if (endDate && isSameDay(date, endDate)) return true
    return false
  }

  const isDisabled = (date: Date) => {
    return isBefore(date, minDate) || isWeekend(date)
  }

  return (
    <div className="w-full max-w-sm">
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          disabled={isBefore(subMonths(currentMonth, 1), startOfMonth(minDate))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week days header */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: adjustedStartDay }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}

        {days.map((day) => {
          const disabled = isDisabled(day)
          const selected = isSelected(day)
          const inRange = isInRange(day)
          const weekend = isWeekend(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => !disabled && onSelectDate(day)}
              disabled={disabled}
              className={cn(
                'relative rounded-lg p-2 text-sm transition-colors',
                disabled && 'cursor-not-allowed text-muted-foreground/50',
                weekend && 'bg-muted/50',
                !disabled && !selected && !inRange && 'hover:bg-accent',
                selected && 'bg-primary text-primary-foreground',
                inRange && !selected && !weekend && 'bg-primary/10',
                startDate && isSameDay(day, startDate) && 'rounded-r-none',
                endDate && isSameDay(day, endDate) && 'rounded-l-none'
              )}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-primary" />
          <span>Sélectionné</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-primary/10" />
          <span>Période</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-muted/50" />
          <span>Weekend</span>
        </div>
      </div>
    </div>
  )
}

interface ParkingSpotGridProps {
  spots: ParkingSpot[]
  selectedSpot: ParkingSpot | null
  onSelectSpot: (spot: ParkingSpot) => void
  isLoading: boolean
}

function ParkingSpotGrid({
  spots,
  selectedSpot,
  onSelectSpot,
  isLoading,
}: ParkingSpotGridProps) {
  // Group spots by row
  const spotsByRow = spots.reduce(
    (acc, spot) => {
      if (!acc[spot.row]) {
        acc[spot.row] = []
      }
      acc[spot.row].push(spot)
      return acc
    },
    {} as Record<string, ParkingSpot[]>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (spots.length === 0) {
    return (
      <div className="rounded-lg bg-muted p-8 text-center">
        <Car className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 font-medium text-foreground">
          Aucune place disponible
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Essayez de modifier vos dates de réservation
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(spotsByRow)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([row, rowSpots]) => (
          <div key={row}>
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">
              Rangée {row}
            </h4>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
              {rowSpots
                .sort((a, b) => a.spotNumber.localeCompare(b.spotNumber))
                .map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => onSelectSpot(spot)}
                    className={cn(
                      'relative flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all',
                      selectedSpot?.id === spot.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    )}
                  >
                    {selectedSpot?.id === spot.id && (
                      <CheckCircle className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-white text-primary" />
                    )}
                    <span className="text-sm font-medium">{spot.spotNumber}</span>
                    {spot.hasElectricCharger && (
                      <Zap className="mt-1 h-3 w-3 text-success" />
                    )}
                  </button>
                ))}
            </div>
          </div>
        ))}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 border-t pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded border-2 border-border" />
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded border-2 border-primary bg-primary/5" />
          <span>Sélectionné</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-success" />
          <span>Borne électrique</span>
        </div>
      </div>
    </div>
  )
}

// Role-based max days limits
const MAX_DAYS_BY_ROLE: Record<string, number> = {
  EMPLOYEE: 5,
  MANAGER: 30,
  SECRETARY: 30, // Same as manager
  ADMIN: 365, // No practical limit
}

export function NewReservationPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const today = startOfDay(new Date())
  const minDate = addDays(today, 1)

  const [step, setStep] = useState<Step>(1)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)

  // Get max days based on user role
  const maxDays = MAX_DAYS_BY_ROLE[user?.role || 'EMPLOYEE'] || 5

  // Fetch available spots when dates are selected
  const { data, isLoading } = useAvailableParkingSpots(
    startDate && endDate
      ? {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        }
      : undefined
  )

  const createReservation = useCreateReservation()

  const handleSelectDate = (date: Date) => {
    setDateError(null)

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(date)
      setEndDate(null)
      setSelectedSpot(null)
    } else if (isBefore(date, startDate)) {
      // Selected date is before start, make it new start
      setStartDate(date)
      setEndDate(null)
      setSelectedSpot(null)
    } else {
      // Validate day limit before setting end date
      const daysDiff = differenceInCalendarDays(date, startDate) + 1
      if (daysDiff > maxDays) {
        setDateError(`Vous ne pouvez pas réserver plus de ${maxDays} jours`)
        return
      }
      // Set end date
      setEndDate(date)
    }
  }

  const handleNextStep = () => {
    if (step === 1 && startDate && endDate) {
      setStep(2)
    } else if (step === 2 && selectedSpot) {
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1)
    } else if (step === 3) {
      setStep(2)
    }
  }

  const handleSubmit = async () => {
    if (!selectedSpot || !startDate || !endDate) return

    setError(null)

    try {
      await createReservation.mutateAsync({
        parkingSpotId: selectedSpot.id,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      })
      navigate('/reservations')
    } catch (err) {
      setError((err as Error).message || 'Une erreur est survenue')
    }
  }

  const parkingSpots = data?.parkingSpots || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="page-title">Nouvelle réservation</h1>
          <p className="mt-1 text-muted-foreground">
            {step === 1 && 'Sélectionnez vos dates de réservation'}
            {step === 2 && 'Choisissez votre place de parking'}
            {step === 3 && 'Vérifiez et confirmez votre réservation'}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <Stepper currentStep={step} />

      {/* Step Content */}
      <Card>
        {/* Step 1: Date Selection */}
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Choisissez vos dates
              </CardTitle>
              <CardDescription>
                Sélectionnez la date de début, puis la date de fin de votre réservation
                <span className="mt-1 block text-xs">
                  (Maximum {maxDays} jour{maxDays > 1 ? 's' : ''})
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <CalendarPicker
                startDate={startDate}
                endDate={endDate}
                onSelectDate={handleSelectDate}
                minDate={minDate}
              />

              {startDate && (
                <div className="mt-6 w-full max-w-sm rounded-lg bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    {endDate ? (
                      <>
                        Du{' '}
                        <span className="font-medium text-foreground">
                          {format(startDate, 'd MMMM yyyy', { locale: fr })}
                        </span>{' '}
                        au{' '}
                        <span className="font-medium text-foreground">
                          {format(endDate, 'd MMMM yyyy', { locale: fr })}
                        </span>
                      </>
                    ) : (
                      <>
                        Début :{' '}
                        <span className="font-medium text-foreground">
                          {format(startDate, 'd MMMM yyyy', { locale: fr })}
                        </span>
                        <br />
                        <span className="text-xs">Sélectionnez la date de fin</span>
                      </>
                    )}
                  </p>
                </div>
              )}

              <div className="mt-6 flex w-full max-w-sm justify-end">
                <Button
                  onClick={handleNextStep}
                  disabled={!startDate || !endDate}
                >
                  Continuer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: Spot Selection */}
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Choisissez votre place
              </CardTitle>
              <CardDescription>
                {parkingSpots.length > 0
                  ? `${parkingSpots.length} place${parkingSpots.length > 1 ? 's' : ''} disponible${parkingSpots.length > 1 ? 's' : ''} pour votre période`
                  : 'Chargement des places disponibles...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ParkingSpotGrid
                spots={parkingSpots}
                selectedSpot={selectedSpot}
                onSelectSpot={setSelectedSpot}
                isLoading={isLoading}
              />

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button onClick={handleNextStep} disabled={!selectedSpot}>
                  Continuer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 3: Summary & Confirmation */}
        {step === 3 && startDate && endDate && selectedSpot && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Récapitulatif
              </CardTitle>
              <CardDescription>
                Vérifiez les détails de votre réservation avant de confirmer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dates */}
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Période
                </div>
                <p className="text-lg font-medium">
                  {format(startDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
                <p className="text-muted-foreground">au</p>
                <p className="text-lg font-medium">
                  {format(endDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
              </div>

              {/* Spot */}
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Car className="h-4 w-4" />
                  Place de parking
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium">
                      Place {selectedSpot.spotNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Rangée {selectedSpot.row}
                    </p>
                  </div>
                  {selectedSpot.hasElectricCharger && (
                    <Badge variant="success">
                      <Zap className="mr-1 h-3 w-3" />
                      Borne électrique
                    </Badge>
                  )}
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button
                  onClick={handleSubmit}
                  isLoading={createReservation.isPending}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Confirmer la réservation
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
