# @parking/api-client

Client API TypeScript pour le système de réservation de parking.

## Installation

### Option 1 : Workspace (monorepo)

Dans le `package.json` racine, ajoutez le workspace :

```json
{
  "workspaces": ["clients", "frontend", "backend"]
}
```

Puis dans le frontend :

```bash
npm install @parking/api-client@*
```

### Option 2 : Installation locale (lien symbolique)

```bash
# Dans le dossier clients
cd clients
npm install
npm run build

# Dans le dossier frontend
cd ../frontend
npm install ../clients
```

### Option 3 : Registry npm privé

```bash
# Dans le dossier clients
npm publish --registry http://your-registry

# Dans le frontend
npm install @parking/api-client --registry http://your-registry
```

## Build

```bash
cd clients
npm install
npm run build    # Build production
npm run dev      # Watch mode
```

## Usage de base

```typescript
import { createApiClient, type AuthResponse } from '@parking/api-client';

// Créer une instance du client avec gestion automatique du refresh token
const api = createApiClient({
  baseUrl: 'http://localhost:3000',
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  onTokenRefresh: (tokens: AuthResponse) => {
    // Sauvegarder les nouveaux tokens
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },
  onUnauthorized: () => {
    // Rediriger vers login si le refresh échoue
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  },
});

// Authentification
const { user, accessToken, refreshToken, expiresIn } = await api.auth.login({
  email: 'employee@parking.com',
  password: 'password123',
});

// Sauvegarder les tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
// expiresIn = 86400 (24h en secondes)

// Rafraîchir manuellement le token
const newTokens = await api.auth.refresh({ refreshToken });

// Déconnexion (invalide le refresh token)
await api.auth.logout({ refreshToken });

// Récupérer les places disponibles
const { parkingSpots } = await api.parkingSpots.getAvailable({
  startDate: '2024-03-15',
  endDate: '2024-03-19',
  hasElectricCharger: true,
});

// Créer une réservation
const { reservation } = await api.reservations.create({
  parkingSpotId: parkingSpots[0].id,
  startDate: '2024-03-15',
  endDate: '2024-03-19',
});

// Check-in via QR code
const { checkIn } = await api.checkin.bySpotNumber('A01');
```

## Gestion des tokens

Le client gère automatiquement le rafraîchissement des tokens :

- **Access Token** : Expire après 24h
- **Refresh Token** : Expire après 7 jours
- **Auto-refresh** : Si une requête retourne 401, le client tente automatiquement de rafraîchir le token

```typescript
// Configuration recommandée
const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  onTokenRefresh: (tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },
  onUnauthorized: () => {
    // Le refresh a échoué, rediriger vers login
    window.location.href = '/login';
  },
});
```

## Usage avec React Query

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createApiClient, queryKeys, invalidateKeys } from '@parking/api-client';

const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  getToken: () => localStorage.getItem('token'),
});

// Hook personnalisé pour les réservations
function useReservations() {
  return useQuery({
    queryKey: queryKeys.reservations.list(),
    queryFn: () => api.reservations.list(),
  });
}

// Hook pour créer une réservation
function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.reservations.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidateKeys.reservations() });
      queryClient.invalidateQueries({ queryKey: invalidateKeys.parkingSpots() });
    },
  });
}

// Dans un composant
function ReservationsList() {
  const { data, isLoading, error } = useReservations();
  const createReservation = useCreateReservation();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <ul>
      {data?.reservations.map((reservation) => (
        <li key={reservation.id}>
          Place {reservation.parkingSpot?.spotNumber} - {reservation.status}
        </li>
      ))}
    </ul>
  );
}
```

## Gestion des erreurs

```typescript
import { ApiError } from '@parking/api-client';

try {
  await api.reservations.create({
    parkingSpotId: 'invalid-id',
    startDate: '2024-03-15',
    endDate: '2024-03-19',
  });
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Erreur ${error.statusCode}: ${error.message}`);
    // error.data contient les détails de l'erreur
  }
}
```

## API Reference

### Auth

| Méthode | Description |
|---------|-------------|
| `auth.register(data)` | Inscription |
| `auth.login(data)` | Connexion |
| `auth.logout()` | Déconnexion |
| `auth.me()` | Profil utilisateur |

### Users (Secretary only)

| Méthode | Description |
|---------|-------------|
| `users.list(params?)` | Liste des utilisateurs |
| `users.get(id)` | Détails utilisateur |
| `users.create(data)` | Créer utilisateur |
| `users.update(id, data)` | Modifier utilisateur |
| `users.delete(id)` | Supprimer utilisateur |

### Parking Spots

| Méthode | Description |
|---------|-------------|
| `parkingSpots.list(params?)` | Liste des places |
| `parkingSpots.get(id)` | Détails place |
| `parkingSpots.getAvailable(params?)` | Places disponibles |
| `parkingSpots.create(data)` | Créer place (Secretary) |
| `parkingSpots.update(id, data)` | Modifier place (Secretary) |
| `parkingSpots.delete(id)` | Supprimer place (Secretary) |

### Reservations

| Méthode | Description |
|---------|-------------|
| `reservations.list(params?)` | Mes réservations |
| `reservations.listAll(params?)` | Toutes les réservations (Secretary) |
| `reservations.get(id)` | Détails réservation |
| `reservations.create(data)` | Créer réservation |
| `reservations.update(id, data)` | Modifier réservation (Secretary) |
| `reservations.cancel(id)` | Annuler réservation |

### Check-in

| Méthode | Description |
|---------|-------------|
| `checkin.bySpotNumber(spotNumber)` | Check-in via QR code |
| `checkin.byReservationId(id)` | Check-in via ID réservation |

### History

| Méthode | Description |
|---------|-------------|
| `history.list(params?)` | Mon historique |
| `history.listAll(params?)` | Historique complet (Secretary) |

### Dashboard (Manager/Secretary)

| Méthode | Description |
|---------|-------------|
| `dashboard.getMetrics(params?)` | Métriques globales |
| `dashboard.getUsageByDay(params?)` | Utilisation quotidienne |
| `dashboard.getPopularSpots(params?)` | Places populaires |

### Email Queue (Secretary)

| Méthode | Description |
|---------|-------------|
| `emailQueue.list(params?)` | Liste des emails |
| `emailQueue.retry(id)` | Réessayer envoi |

### Jobs (Secretary)

| Méthode | Description |
|---------|-------------|
| `jobs.expireReservations()` | Expirer réservations manuellement |

## Endpoints

Les endpoints sont exportés pour un usage direct si nécessaire :

```typescript
import { ENDPOINTS } from '@parking/api-client';

console.log(ENDPOINTS.auth.login);           // '/api/auth/login'
console.log(ENDPOINTS.users.detail('123'));  // '/api/users/123'
```

## Types exportés

Tous les types sont exportés depuis le module principal :

```typescript
import type {
  User,
  ParkingSpot,
  Reservation,
  CheckIn,
  Role,
  ReservationStatus,
  CreateReservationDto,
  // ... etc
} from '@parking/api-client';
```
