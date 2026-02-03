import { useApiQuery } from "./use-api";
import {
  mapParkingSpotFromApi,
  type ParkingSpot,
  type ParkingSpotApi,
} from "~/types/parking-spot";

export function useParkingSpots(date: string | null, chargerRequired?: boolean) {
  const query = useApiQuery<ParkingSpotApi[]>(
    ["parking-spots", date, chargerRequired],
    `/parking-spots${date ? `?date=${date}${chargerRequired ? "&chargerRequired=true" : ""}` : ""}`,
    {
      enabled: !!date,
    }
  );

  // Transform the data to frontend format
  const spots: ParkingSpot[] | undefined = query.data?.map(mapParkingSpotFromApi);

  return {
    ...query,
    data: spots,
  };
}
