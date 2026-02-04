import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  QueryReservationParams,
  CreateReservationDto,
  Reservation,
} from '@parking/api-client'

// Query keys
export const reservationKeys = {
  all: ['reservations'] as const,
  lists: () => [...reservationKeys.all, 'list'] as const,
  list: (params?: QueryReservationParams) => [...reservationKeys.lists(), params] as const,
  details: () => [...reservationKeys.all, 'detail'] as const,
  detail: (id: string) => [...reservationKeys.details(), id] as const,
}

// Get user's reservations
export function useReservations(params?: QueryReservationParams) {
  return useQuery({
    queryKey: reservationKeys.list(params),
    queryFn: () => api.reservations.list(params),
  })
}

// Get single reservation
export function useReservation(id: string) {
  return useQuery({
    queryKey: reservationKeys.detail(id),
    queryFn: () => api.reservations.get(id),
    enabled: !!id,
  })
}

// Create reservation
export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReservationDto) => api.reservations.create(data),
    onSuccess: () => {
      // Invalidate reservations list
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() })
      // Invalidate parking spots availability
      queryClient.invalidateQueries({ queryKey: ['parkingSpots'] })
    },
  })
}

// Cancel reservation
export function useCancelReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.reservations.cancel(id),
    onSuccess: (_data, id) => {
      // Invalidate reservations list
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() })
      // Invalidate specific reservation
      queryClient.invalidateQueries({ queryKey: reservationKeys.detail(id) })
      // Invalidate parking spots availability
      queryClient.invalidateQueries({ queryKey: ['parkingSpots'] })
    },
  })
}

// Helper to check if a reservation can be cancelled
export function canCancelReservation(reservation: Reservation): boolean {
  return reservation.status === 'PENDING' || reservation.status === 'CONFIRMED'
}
