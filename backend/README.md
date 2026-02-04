# Parking Reservation Backend

Backend NestJS pour le système de réservation de parking.

## Prérequis

- Node.js >= 18
- Docker et Docker Compose
- npm ou yarn

## Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Lancer les services (PostgreSQL + Redis)
docker-compose up -d

# Générer le client Prisma
npm run prisma:generate

# Appliquer les migrations
npm run prisma:migrate

# Seed de la base de données (optionnel)
npm run prisma:seed
```

## Lancer l'application

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

## Documentation API

Une fois l'application lancée, accédez à Swagger :
- http://localhost:3000/api/docs

## Utilisateurs par défaut (après seed)

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| secretary@parking.com | password123 | Secretary |
| manager@parking.com | password123 | Manager |
| employee@parking.com | password123 | Employee |

## Structure du projet

```
src/
├── auth/           # Authentification JWT
├── users/          # Gestion des utilisateurs
├── parking-spots/  # Gestion des places de parking
├── reservations/   # Gestion des réservations
├── checkin/        # Check-in via QR code
├── history/        # Historique des réservations
├── dashboard/      # Métriques et statistiques
├── email-queue/    # File d'attente des emails
├── jobs/           # Jobs planifiés (cron)
├── prisma/         # Configuration Prisma
└── common/         # Guards, decorators, enums
```

## Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture
npm run test:cov
```

## Scripts utiles

```bash
# Ouvrir Prisma Studio
npm run prisma:studio

# Formater le code
npm run format

# Lint
npm run lint
```
