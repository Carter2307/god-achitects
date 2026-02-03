export type SpotStatus = "available" | "reserved" | "occupied" | "maintenance";

export type SpotRow = "A" | "B" | "C" | "D" | "E" | "F";

export interface ParkingSpot {
  id: string;
  row: SpotRow;
  number: number;
  hasCharger: boolean;
  status: SpotStatus;
  qrCode: string;
}

// Type from backend API
export interface ParkingSpotApi {
  id: string;
  numero: string;
  rangee: string;
  aChargeurElectrique: boolean;
  statut: "DISPONIBLE" | "RESERVEE" | "OCCUPEE";
  qrCodeUrl: string;
}

// Map backend status to frontend status
const statusMap: Record<ParkingSpotApi["statut"], SpotStatus> = {
  DISPONIBLE: "available",
  RESERVEE: "reserved",
  OCCUPEE: "occupied",
};

// Transform API response to frontend type
export function mapParkingSpotFromApi(spot: ParkingSpotApi): ParkingSpot {
  return {
    id: spot.id,
    row: spot.rangee as SpotRow,
    number: parseInt(spot.numero.replace(/[A-F]/g, ""), 10),
    hasCharger: spot.aChargeurElectrique,
    status: statusMap[spot.statut],
    qrCode: spot.qrCodeUrl,
  };
}

export interface ParkingSpotWithReservation extends ParkingSpot {
  currentReservation?: {
    id: string;
    userId: string;
    userName: string;
    startDate: string;
    endDate: string;
  };
}

export interface CreateParkingSpotInput {
  row: SpotRow;
  number: number;
  hasCharger: boolean;
}

export interface UpdateParkingSpotInput {
  hasCharger?: boolean;
  status?: SpotStatus;
}
