// Enums
export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  SECRETARY = 'SECRETARY',
  MANAGER = 'MANAGER',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum EmailStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export enum EmailMessageType {
  RESERVATION_CONFIRMATION = 'RESERVATION_CONFIRMATION',
  RESERVATION_REMINDER = 'RESERVATION_REMINDER',
  RESERVATION_CANCELLED = 'RESERVATION_CANCELLED',
  RESERVATION_EXPIRED = 'RESERVATION_EXPIRED',
}

// Base types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingSpot {
  id: string;
  spotNumber: string;
  row: string;
  hasElectricCharger: boolean;
  isAvailable: boolean;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  parkingSpotId: string;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
  parkingSpot?: ParkingSpot;
  checkIn?: CheckIn;
}

export interface CheckIn {
  id: string;
  reservationId: string;
  checkInTime: string;
  createdAt: string;
}

export interface ReservationHistory {
  id: string;
  reservationId: string;
  userId: string;
  parkingSpotId: string;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  checkInTime?: string;
  createdAt: string;
  reservation?: Reservation;
}

export interface EmailQueue {
  id: string;
  reservationId: string;
  recipientEmail: string;
  messageType: EmailMessageType;
  status: EmailStatus;
  createdAt: string;
  sentAt?: string;
  reservation?: Reservation;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Auth DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse extends AuthTokens {
  user: Omit<User, 'updatedAt'>;
}

// User DTOs
export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

export interface QueryUserParams {
  role?: Role;
  page?: number;
  limit?: number;
}

export interface UsersResponse {
  users: User[];
  pagination: Pagination;
}

// Parking Spot DTOs
export interface CreateParkingSpotDto {
  spotNumber: string;
  row: string;
  hasElectricCharger?: boolean;
}

export interface UpdateParkingSpotDto {
  spotNumber?: string;
  row?: string;
  hasElectricCharger?: boolean;
  isAvailable?: boolean;
}

export interface QueryParkingSpotParams {
  row?: string;
  hasElectricCharger?: boolean;
  isAvailable?: boolean;
}

export interface QueryAvailableSpotsParams {
  startDate?: string;
  endDate?: string;
  hasElectricCharger?: boolean;
}

export interface ParkingSpotsResponse {
  parkingSpots: ParkingSpot[];
}

// Reservation DTOs
export interface CreateReservationDto {
  parkingSpotId: string;
  startDate: string;
  endDate: string;
}

export interface UpdateReservationDto {
  parkingSpotId?: string;
  startDate?: string;
  endDate?: string;
  status?: ReservationStatus;
}

export interface QueryReservationParams {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
}

export interface QueryAllReservationsParams extends QueryReservationParams {
  userId?: string;
  page?: number;
  limit?: number;
}

export interface ReservationsResponse {
  reservations: Reservation[];
}

export interface ReservationsWithPaginationResponse {
  reservations: Reservation[];
  pagination: Pagination;
}

// Check-in Response
export interface CheckInResponse {
  checkIn: CheckIn;
  reservation: Reservation;
}

// History DTOs
export interface QueryHistoryParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface QueryAllHistoryParams extends QueryHistoryParams {
  userId?: string;
  parkingSpotId?: string;
}

export interface HistoryResponse {
  history: ReservationHistory[];
  pagination: Pagination;
}

// Dashboard DTOs
export interface QueryDashboardParams {
  startDate?: string;
  endDate?: string;
}

export interface QueryPopularSpotsParams {
  limit?: number;
}

export interface DashboardMetrics {
  totalReservations: number;
  occupancyRate: number;
  noShowRate: number;
  electricChargerUsageRate: number;
  averageReservationDuration: number;
}

export interface DailyUsage {
  date: string;
  reservations: number;
  totalSpots: number;
  occupancyRate: number;
}

export interface DailyUsageResponse {
  dailyUsage: DailyUsage[];
}

export interface PopularSpot {
  id: string;
  spotNumber: string;
  row: string;
  hasElectricCharger: boolean;
  reservationCount: number;
}

export interface PopularSpotsResponse {
  spots: PopularSpot[];
}

// Email Queue DTOs
export interface QueryEmailQueueParams {
  status?: EmailStatus;
  page?: number;
  limit?: number;
}

export interface EmailQueueResponse {
  messages: EmailQueue[];
  pagination: Pagination;
}

// Generic responses
export interface MessageResponse {
  message: string;
}

export interface UserResponse {
  user: User;
}

export interface ParkingSpotResponse {
  parkingSpot: ParkingSpot;
}

export interface ReservationResponse {
  reservation: Reservation;
}

// Jobs
export interface ExpireReservationsResponse {
  expiredCount: number;
}
