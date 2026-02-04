# Routes API - Système de Réservation de Parking

## Authentication

### POST /api/auth/register
**Description :** Inscription d'un nouvel utilisateur  
**Body :** `{ email, password, firstName, lastName }`  
**Response :** `{ user, token }`  
**Access :** Public

### POST /api/auth/login
**Description :** Connexion utilisateur  
**Body :** `{ email, password }`  
**Response :** `{ user, token }`  
**Access :** Public

### POST /api/auth/logout
**Description :** Déconnexion utilisateur  
**Response :** `{ message }`  
**Access :** Authenticated

### GET /api/auth/me
**Description :** Récupérer les informations de l'utilisateur connecté  
**Response :** `{ user }`  
**Access :** Authenticated

---

## Users (Gestion des utilisateurs)

### GET /api/users
**Description :** Liste de tous les utilisateurs  
**Query params :** `?role=Employee&page=1&limit=10`  
**Response :** `{ users[], pagination }`  
**Access :** Secretary only

### GET /api/users/:id
**Description :** Détails d'un utilisateur spécifique  
**Response :** `{ user }`  
**Access :** Secretary only

### POST /api/users
**Description :** Créer un nouvel utilisateur  
**Body :** `{ email, password, firstName, lastName, role }`  
**Response :** `{ user }`  
**Access :** Secretary only

### PUT /api/users/:id
**Description :** Modifier un utilisateur  
**Body :** `{ email?, firstName?, lastName?, role? }`  
**Response :** `{ user }`  
**Access :** Secretary only

### DELETE /api/users/:id
**Description :** Supprimer un utilisateur  
**Response :** `{ message }`  
**Access :** Secretary only

---

## Parking Spots

### GET /api/parking-spots
**Description :** Liste de toutes les places de parking  
**Query params :** `?row=A&hasElectricCharger=true&isAvailable=true`  
**Response :** `{ parkingSpots[] }`  
**Access :** Authenticated

### GET /api/parking-spots/:id
**Description :** Détails d'une place de parking  
**Response :** `{ parkingSpot }`  
**Access :** Authenticated

### GET /api/parking-spots/available
**Description :** Places disponibles pour une période donnée  
**Query params :** `?startDate=2024-03-15&endDate=2024-03-19&hasElectricCharger=true`  
**Response :** `{ parkingSpots[] }`  
**Access :** Authenticated

### POST /api/parking-spots
**Description :** Créer une nouvelle place de parking  
**Body :** `{ spotNumber, row, hasElectricCharger }`  
**Response :** `{ parkingSpot }`  
**Access :** Secretary only

### PUT /api/parking-spots/:id
**Description :** Modifier une place de parking  
**Body :** `{ spotNumber?, row?, hasElectricCharger?, isAvailable? }`  
**Response :** `{ parkingSpot }`  
**Access :** Secretary only

### DELETE /api/parking-spots/:id
**Description :** Supprimer une place de parking  
**Response :** `{ message }`  
**Access :** Secretary only

---

## Reservations

### GET /api/reservations
**Description :** Liste des réservations de l'utilisateur connecté  
**Query params :** `?status=Confirmed&startDate=2024-03-01&endDate=2024-03-31`  
**Response :** `{ reservations[] }`  
**Access :** Employee, Manager

### GET /api/reservations/all
**Description :** Liste de toutes les réservations (tous utilisateurs)  
**Query params :** `?userId=123&status=Pending&page=1&limit=10`  
**Response :** `{ reservations[], pagination }`  
**Access :** Secretary only

### GET /api/reservations/:id
**Description :** Détails d'une réservation spécifique  
**Response :** `{ reservation }`  
**Access :** Owner, Secretary

### POST /api/reservations
**Description :** Créer une nouvelle réservation  
**Body :** `{ parkingSpotId, startDate, endDate }`  
**Response :** `{ reservation }`  
**Access :** Employee, Manager  
**Business Logic :**
- Vérifier la disponibilité de la place
- Vérifier les contraintes de durée (5 jours pour Employee, 30 jours pour Manager)
- Envoyer un message à la queue d'emails

### PUT /api/reservations/:id
**Description :** Modifier une réservation  
**Body :** `{ startDate?, endDate?, status?, parkingSpotId? }`  
**Response :** `{ reservation }`  
**Access :** Secretary only

### DELETE /api/reservations/:id
**Description :** Annuler une réservation  
**Response :** `{ message }`  
**Access :** Owner, Secretary

---

## Check-in

### POST /api/checkin/:spotNumber
**Description :** Enregistrer l'arrivée via scan du QR code  
**Response :** `{ checkIn, reservation }`  
**Access :** Authenticated  
**Business Logic :**
- Vérifier qu'une réservation active existe pour cet utilisateur et cette place
- Créer un CheckIn
- Mettre à jour le status de la réservation à "Confirmed"

### POST /api/checkin/reservation/:reservationId
**Description :** Enregistrer l'arrivée via l'ID de réservation  
**Response :** `{ checkIn, reservation }`  
**Access :** Owner, Secretary

---

## Reservation History

### GET /api/history
**Description :** Historique complet des réservations de l'utilisateur connecté  
**Query params :** `?startDate=2024-01-01&endDate=2024-12-31&page=1&limit=20`  
**Response :** `{ history[], pagination }`  
**Access :** Employee, Manager

### GET /api/history/all
**Description :** Historique complet de toutes les réservations  
**Query params :** `?userId=123&parkingSpotId=45&page=1&limit=20`  
**Response :** `{ history[], pagination }`  
**Access :** Secretary only

---

## Dashboard (Metrics)

### GET /api/dashboard/metrics
**Description :** Métriques globales pour le tableau de bord  
**Query params :** `?startDate=2024-03-01&endDate=2024-03-31`  
**Response :**
```json
{
  "totalReservations": 150,
  "occupancyRate": 75.5,
  "noShowRate": 8.2,
  "electricChargerUsageRate": 45.3,
  "averageReservationDuration": 2.5
}
```
**Access :** Manager, Secretary

### GET /api/dashboard/usage-by-day
**Description :** Utilisation quotidienne du parking  
**Query params :** `?startDate=2024-03-01&endDate=2024-03-31`  
**Response :** `{ dailyUsage[] }`  
**Access :** Manager, Secretary

### GET /api/dashboard/popular-spots
**Description :** Places les plus réservées  
**Query params :** `?limit=10`  
**Response :** `{ spots[] }`  
**Access :** Manager, Secretary

---

## Email Queue (Admin/Internal)

### GET /api/email-queue
**Description :** Liste des messages en attente  
**Query params :** `?status=Pending&page=1&limit=50`  
**Response :** `{ messages[], pagination }`  
**Access :** Secretary only

### POST /api/email-queue/retry/:id
**Description :** Réessayer l'envoi d'un email échoué  
**Response :** `{ message }`  
**Access :** Secretary only

---

## Background Jobs (Scheduled Tasks)

### POST /api/jobs/expire-reservations
**Description :** Job automatique pour expirer les réservations non confirmées après 11h  
**Access :** Internal/Cron only  
**Business Logic :**
- Chercher toutes les réservations avec status "Pending" et startDate = aujourd'hui
- Si checkIn n'existe pas et il est après 11h, changer le status à "Expired"
- Marquer la place comme disponible

---

## Notes d'implémentation

**Authentification :** Toutes les routes (sauf `/api/auth/*`) nécessitent un token JWT valide.

**Autorisations :**
- **Employee :** Peut gérer ses propres réservations et voir les places disponibles
- **Manager :** Mêmes droits que Employee + accès au dashboard
- **Secretary :** Accès complet à toutes les fonctionnalités (CRUD sur tous les utilisateurs, réservations, places)

**Validation :**
- Toutes les routes doivent valider les données d'entrée
- Les dates doivent être validées (format, cohérence startDate ≤ endDate, etc.)
- Les contraintes métier doivent être vérifiées (durée max selon le rôle, disponibilité, etc.)

**Pagination :**
- Par défaut : `page=1, limit=20`
- Maximum : `limit=100`