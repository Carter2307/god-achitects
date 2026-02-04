import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { QueryParkingSpotParams, QueryAvailableSpotsParams } from '@parking/api-client'

// Query keys
export const parkingSpotKeys = {
  all: ['parkingSpots'] as const,
  lists: () => [...parkingSpotKeys.all, 'list'] as const,
  list: (params?: QueryParkingSpotParams) => [...parkingSpotKeys.lists(), params] as const,
  available: (params?: QueryAvailableSpotsParams) =>
    [...parkingSpotKeys.all, 'available', params] as const,
  details: () => [...parkingSpotKeys.all, 'detail'] as const,
  detail: (id: string) => [...parkingSpotKeys.details(), id] as const,
}

// Get all parking spots
export function useParkingSpots(params?: QueryParkingSpotParams) {
  return useQuery({
    queryKey: parkingSpotKeys.list(params),
    queryFn: () => api.parkingSpots.list(params),
  })
}

// Get available parking spots for a date range
export function useAvailableParkingSpots(params?: QueryAvailableSpotsParams) {
  return useQuery({
    queryKey: parkingSpotKeys.available(params),
    queryFn: () => api.parkingSpots.getAvailable(params),
    enabled: !!(params?.startDate && params?.endDate),
  })
}

// Get single parking spot
export function useParkingSpot(id: string) {
  return useQuery({
    queryKey: parkingSpotKeys.detail(id),
    queryFn: () => api.parkingSpots.get(id),
    enabled: !!id,
  })
}
