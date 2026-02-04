import { createBrowserRouter } from 'react-router'
import { AuthLayout, AppLayout } from '@/layouts'
import {
  DashboardPage,
  ReservationsPage,
  NewReservationPage,
  HistoryPage,
  ProfilePage,
  ParkingSpotsPage,
  UsersPage,
  NotFoundPage,
  LoginPage,
  RegisterPage,
} from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'reservations',
        element: <ReservationsPage />,
      },
      {
        path: 'reservations/new',
        element: <NewReservationPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'parking-spots',
        element: <ParkingSpotsPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
