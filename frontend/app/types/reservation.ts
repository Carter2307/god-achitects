export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Reservation {
  id: string;
  userId: string;
  parkingSpotId: string;
  date: string;
  statut: ReservationStatus;
  besoinChargeur: boolean;
  checkInDeadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationWithDetails extends Reservation {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  parkingSpot: {
    id: string;
    row: string;
    number: number;
    hasCharger: boolean;
  };
}

export interface CreateReservationInput {
  userId: string;
  date: string;
  parkingSpotId: string;
  besoinChargeur: boolean;
}

export interface UpdateReservationInput {
  parkingSpotId?: string;
  startDate?: string;
  endDate?: string;
  status?: ReservationStatus;
}
