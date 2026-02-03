export type CheckInMethod = "qr_code" | "manual" | "auto";

export interface CheckIn {
  id: string;
  reservationId: string;
  userId: string;
  method: CheckInMethod;
  checkedInAt: string;
  checkedInBy?: string;
}

export interface CheckInResponse {
  success: boolean;
  message: string;
  checkIn?: CheckIn;
  reservation?: {
    id: string;
    parkingSpot: {
      row: string;
      number: number;
    };
    startDate: string;
    endDate: string;
  };
}

export interface ManualCheckInInput {
  reservationId: string;
  userId: string;
}
