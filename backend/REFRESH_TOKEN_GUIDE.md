# Guide d'utilisation du Refresh Token

## Démarrage rapide

### 1. Démarrer le serveur

```bash
npm run start:dev
```

Le serveur démarre sur `http://localhost:3000`

### 2. Tester l'implémentation

#### Option 1 : Tests automatisés (Recommandé)

```bash
# Lancer les tests E2E pour le refresh token
npm run test:e2e -- auth-refresh.e2e-spec.ts
```

#### Option 2 : Tests manuels avec Swagger

1. Ouvrir le navigateur : `http://localhost:3000/api/docs`
2. Tester les endpoints dans cet ordre :
   - `POST /api/auth/register` - Créer un utilisateur
   - `POST /api/auth/login` - Se connecter
   - `GET /api/auth/me` - Vérifier le profil (avec access token)
   - `POST /api/auth/refresh` - Rafraîchir le token
   - `POST /api/auth/logout` - Se déconnecter

#### Option 3 : Tests avec cURL

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "secretary@parking.com",
    "password": "SecretaryPass123"
  }'

# Sauvegarder les tokens de la réponse
# accessToken: pour les requêtes API
# refreshToken: pour rafraîchir l'access token

# 2. Utiliser l'access token
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

# 3. Rafraîchir les tokens
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<REFRESH_TOKEN>"
  }'

# 4. Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<REFRESH_TOKEN>"
  }'
```

## Utilisateurs de test

Si vous avez exécuté `npm run seed`, vous avez accès à ces utilisateurs :

```javascript
// Secrétaire
{
  "email": "secretary@parking.com",
  "password": "SecretaryPass123"
}

// Manager
{
  "email": "manager@parking.com",
  "password": "ManagerPass123"
}

// Employé
{
  "email": "employee@parking.com",
  "password": "EmployeePass123"
}
```

## Flux complet d'authentification

### Frontend - Exemple d'implémentation

```typescript
// 1. Login
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // Stocker les tokens
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

// 2. Requête API avec access token
const fetchProtectedData = async (url: string) => {
  const accessToken = localStorage.getItem('accessToken');

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  // Si 401, rafraîchir le token
  if (response.status === 401) {
    await refreshAccessToken();
    // Réessayer la requête
    return fetchProtectedData(url);
  }

  return response.json();
};

// 3. Rafraîchir l'access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  const response = await fetch('http://localhost:3000/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    // Refresh token invalide ou expiré, rediriger vers login
    logout();
    window.location.href = '/login';
    return;
  }

  const data = await response.json();

  // Mettre à jour les tokens
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  return data;
};

// 4. Logout
const logout = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  await fetch('http://localhost:3000/api/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  // Supprimer les tokens
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};
```

## Vérification de la base de données

### Voir les refresh tokens stockés

```bash
# Connexion à PostgreSQL
psql -U postgres -d parking_reservation

# Voir tous les refresh tokens
SELECT * FROM refresh_tokens;

# Voir les tokens d'un utilisateur spécifique
SELECT rt.*, u.email
FROM refresh_tokens rt
JOIN users u ON rt."userId" = u.id
WHERE u.email = 'secretary@parking.com';

# Compter les tokens par utilisateur
SELECT u.email, COUNT(rt.id) as token_count
FROM users u
LEFT JOIN refresh_tokens rt ON u.id = rt."userId"
GROUP BY u.email;
```

## Sécurité - Bonnes pratiques

### ✅ Ce qui est implémenté

1. **Rotation des tokens** : Chaque refresh génère un nouveau refresh token
2. **Expiration** : Access token (24h), Refresh token (7 jours)
3. **Nettoyage automatique** : Les tokens expirés sont supprimés
4. **Tokens uniques** : Utilisation d'UUID v4
5. **Cascade delete** : Suppression des tokens lors de la suppression d'un utilisateur

### ⚠️ À faire en production

1. **Changer les secrets** dans `.env` :
   ```env
   JWT_SECRET="votre-secret-très-long-et-aléatoire"
   JWT_REFRESH_SECRET="un-autre-secret-différent-et-long"
   ```

2. **Stocker les refresh tokens côté client** :
   - Option sécurisée : httpOnly cookies
   - Option alternative : localStorage (moins sécurisé pour XSS)

3. **HTTPS obligatoire** en production

4. **Rate limiting** sur `/auth/refresh` (déjà configuré avec Throttler)

5. **Audit logging** des refresh/logout

## Dépannage

### Erreur : "Refresh token invalide"
- Le token a déjà été utilisé (rotation)
- Le token a expiré
- Le token n'existe pas dans la base de données

**Solution** : Demander à l'utilisateur de se reconnecter

### Erreur : "Authentification requise"
- Access token manquant ou invalide
- Access token expiré

**Solution** : Utiliser le refresh token pour obtenir un nouvel access token

### Les tests E2E échouent
```bash
# Vérifier que la base de données est accessible
npm run db:migrate

# Nettoyer la base de données
npm run db:reset

# Relancer les tests
npm run test:e2e
```

## Documentation complète

Voir `docs/refresh-token-implementation.md` pour la documentation technique complète.