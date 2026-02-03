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
