import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Auth routes
  route("login", "routes/auth/login.tsx"),

  // Check-in via QR code (public)
  route("check-in/:code", "routes/check-in.tsx"),

  // Employee routes
  layout("routes/employee/layout.tsx", [
    route("employee", "routes/employee/dashboard.tsx"),
    route("employee/reservations", "routes/employee/reservations.tsx"),
    route("employee/reservations/new", "routes/employee/new-reservation.tsx"),
    route("employee/reservations/history", "routes/employee/history.tsx"),
    route("employee/check-in", "routes/employee/check-in.tsx"),
    route("employee/profile", "routes/employee/profile.tsx"),
  ]),

  // Secretary routes (admin)
  layout("routes/secretary/layout.tsx", [
    route("secretary", "routes/secretary/dashboard.tsx"),
    route("secretary/users", "routes/secretary/users.tsx"),
    route("secretary/users/new", "routes/secretary/new-user.tsx"),
    route("secretary/users/:id", "routes/secretary/edit-user.tsx"),
    route("secretary/reservations", "routes/secretary/reservations.tsx"),
    route("secretary/parking-spots", "routes/secretary/parking-spots.tsx"),
    route("secretary/check-in", "routes/secretary/manual-check-in.tsx"),
  ]),

  // Manager routes
  layout("routes/manager/layout.tsx", [
    route("manager", "routes/manager/dashboard.tsx"),
    route("manager/reservations", "routes/manager/reservations.tsx"),
    route("manager/reservations/new", "routes/manager/new-reservation.tsx"),
    route("manager/reservations/history", "routes/manager/history.tsx"),
  ]),
] satisfies RouteConfig;
