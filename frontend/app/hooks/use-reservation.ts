import { useApiMutation, useInvalidateQueries } from "./use-api";
import type { CreateReservationInput, Reservation } from "~/types/reservation";

export function useCreateReservation() {
  const invalidate = useInvalidateQueries();

  return useApiMutation<Reservation, CreateReservationInput>("/reservations", {
    onSuccess: () => {
      // Invalidate parking spots cache to refresh availability
      invalidate(["parking-spots"]);
    },
  });
}

