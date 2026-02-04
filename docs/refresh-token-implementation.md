# Implémentation du Refresh Token

## Résumé

L'implémentation du système de refresh token est maintenant **complète** et fonctionnelle dans le backend.

## Architecture

### 1. Modèle de données (Prisma)

La table `refresh_tokens` a été créée avec le schéma suivant :

```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}
```

**Migration appliquée** : `20260204211100_add_refresh_tokens`

### 2. Endpoints API

#### POST `/api/auth/login`
- Authentifie un utilisateur avec email/mot de passe
- Retourne un `accessToken` et un `refreshToken`

**Exemple de réponse :**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "EMPLOYEE"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "uuid-refresh-token",
  "expiresIn": 86400
}
```

#### POST `/api/auth/register`
- Crée un nouvel utilisateur
- Retourne un `accessToken` et un `refreshToken`

**Structure identique à `/api/auth/login`**

#### POST `/api/auth/refresh`
- Rafraîchit l'access token en utilisant le refresh token
- Implémente la **rotation des tokens** (l'ancien refresh token est supprimé)

**Requête :**
```json
{
  "refreshToken": "uuid-refresh-token"
}
```

**Réponse :**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "EMPLOYEE"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "new-uuid-refresh-token",
  "expiresIn": 86400
}
```

#### POST `/api/auth/logout`
- Supprime le refresh token spécifié (ou tous les refresh tokens de l'utilisateur)
- Nécessite un Bearer token dans l'en-tête Authorization

**Requête (optionnel) :**
```json
{
  "refreshToken": "uuid-refresh-token"
}
```

**Réponse :**
```json
{
  "message": "Déconnexion réussie"
}
```

#### GET `/api/auth/me`
- Récupère le profil de l'utilisateur connecté
- Nécessite un Bearer token

**Réponse :**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "EMPLOYEE",
    "createdAt": "2026-02-04T00:00:00.000Z",
    "updatedAt": "2026-02-04T00:00:00.000Z"
  }
}
```

## Sécurité

### Fonctionnalités de sécurité implémentées :

1. **Rotation des tokens** : À chaque refresh, l'ancien refresh token est supprimé et un nouveau est créé
2. **Expiration** : Les refresh tokens expirent après 7 jours (configurable via `JWT_REFRESH_EXPIRES_IN`)
3. **Nettoyage automatique** : Les tokens expirés sont supprimés lors de la génération de nouveaux tokens
4. **Cascade delete** : Lors de la suppression d'un utilisateur, tous ses refresh tokens sont supprimés
5. **Token unique** : Chaque refresh token est unique (UUID v4)

## Configuration

Les variables d'environnement nécessaires dans `.env` :

```env
# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"                    # Durée de vie de l'access token
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
JWT_REFRESH_EXPIRES_IN="7d"             # Durée de vie du refresh token
```

## Flux d'authentification

```
1. Login/Register
   ↓
2. Reçoit accessToken + refreshToken
   ↓
3. Utilise accessToken pour les requêtes API
   ↓
4. Quand accessToken expire (après 24h)
   ↓
5. Appelle /api/auth/refresh avec refreshToken
   ↓
6. Reçoit nouveau accessToken + nouveau refreshToken
   ↓
7. Répète étape 3
```

## Tests manuels

### 1. Test de login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 2. Test de refresh

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "le-refresh-token-reçu"
  }'
```

### 3. Test de profil (avec access token)

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer le-access-token"
```

### 4. Test de logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer le-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "le-refresh-token"
  }'
```

## Documentation Swagger

La documentation interactive est disponible à l'adresse :
```
http://localhost:3000/api/docs
```

Tous les endpoints d'authentification y sont documentés avec des exemples.

## Fichiers modifiés/créés

### Créés
- `src/auth/dto/refresh-token.dto.ts` - DTO pour le refresh token
- `prisma/migrations/20260204211100_add_refresh_tokens/` - Migration de la table

### Modifiés
- `prisma/schema.prisma` - Ajout du modèle RefreshToken
- `src/auth/auth.service.ts` - Méthodes refresh(), logout(), generateTokens()
- `src/auth/auth.controller.ts` - Endpoints /refresh et /logout
- `src/auth/auth.module.ts` - Configuration JWT

## Statut

✅ **Implémentation complète et opérationnelle**

- ✅ Modèle de données
- ✅ Migration de base de données
- ✅ Services d'authentification
- ✅ Endpoints API
- ✅ Rotation des tokens
- ✅ Gestion de l'expiration
- ✅ Documentation Swagger
- ✅ DTO et validation
- ✅ Build réussi
