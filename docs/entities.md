# Entités du Système de Réservation de Parking

## Entités Principales

### User
**Attributs :**
- id
- email
- password
- firstName
- lastName
- role (Employee/Secretary/Manager)
- createdAt
- updatedAt

**Description :** Représente tous les utilisateurs du système avec différents niveaux de permissions.

---

### ParkingSpot
**Attributs :**
- id
- spotNumber
- row
- hasElectricCharger
- isAvailable
- qrCode
- createdAt
- updatedAt

**Description :** Représente les places de parking individuelles dans l'installation.

---

### Reservation
**Attributs :**
- id
- userId
- parkingSpotId
- startDate
- endDate
- status (Pending/Confirmed/Cancelled/Expired)
- createdAt
- updatedAt

**Description :** Représente une réservation effectuée par un utilisateur pour une place de parking spécifique. Supporte les réservations d'un seul jour (startDate = endDate) ou de plusieurs jours (startDate ≠ endDate).

---

### CheckIn
**Attributs :**
- id
- reservationId
- checkInTime
- createdAt

**Description :** Enregistre la confirmation d'arrivée d'un employé à sa place de parking.

---

## Entités de Support

### ReservationHistory
**Attributs :**
- id
- reservationId
- userId
- parkingSpotId
- startDate
- endDate
- status
- checkInTime
- createdAt

**Description :** Archive de toutes les réservations passées pour l'analytique et la conservation des données.

---

### EmailQueue
**Attributs :**
- id
- reservationId
- recipientEmail
- messageType
- status (Pending/Sent/Failed)
- createdAt
- sentAt

**Description :** Messages en attente de traitement par le service d'envoi d'emails.

---

### DashboardMetrics
**Attributs :**
- date
- totalReservations
- occupancyRate
- noShowRate
- electricChargerUsageRate

**Description :** Données analytiques pour le tableau de bord des managers (potentiellement une vue/agrégat plutôt qu'une entité stockée).

---

## Relations

- User (1) → (N) Reservation
- ParkingSpot (1) → (N) Reservation
- Reservation (1) → (0-1) CheckIn
- Reservation (1) → (1) EmailQueue
- Reservation (1) → (1) ReservationHistory