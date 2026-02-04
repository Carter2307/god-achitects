# Outils et Technologies - Backend NestJS

## Framework Principal

### NestJS
**Version :** `^10.0.0`  
**Description :** Framework Node.js progressif pour construire des applications server-side efficaces et scalables  
**Installation :** `npm i @nestjs/core @nestjs/common @nestjs/platform-express`

---

## Base de Données

### Prisma ORM
**Version :** `^0.3.0`  
**Description :** ORM pour TypeScript et JavaScript (supporte PostgreSQL, MySQL, SQLite, etc.)  
**Installation :** `npm i @nestjs/typeorm typeorm`

### PostgreSQL Driver
**Version :** `^8.11.0`  
**Description :** Driver pour PostgreSQL  


---

## Authentification & Sécurité

### Passport
**Description :** Middleware d'authentification pour Node.js  
**Installation :** `npm i @nestjs/passport passport`

### Passport JWT
**Description :** Stratégie JWT pour Passport  
**Installation :** `npm i @nestjs/jwt passport-jwt`  
**Types :** `npm i -D @types/passport-jwt`

### bcrypt
**Version :** `^5.1.0`  
**Description :** Bibliothèque pour hasher les mots de passe  
**Installation :** `npm i bcrypt`  
**Types :** `npm i -D @types/bcrypt`

---

## Validation

### class-validator
**Version :** `^0.14.0`  
**Description :** Validation basée sur des décorateurs pour les classes  
**Installation :** `npm i class-validator`

### class-transformer
**Version :** `^0.5.0`  
**Description :** Transformation d'objets plain en instances de classe  
**Installation :** `npm i class-transformer`

---

## Configuration

### @nestjs/config
**Description :** Module de configuration pour NestJS (basé sur dotenv)  
**Installation :** `npm i @nestjs/config`

### dotenv
**Version :** `^16.0.0`  
**Description :** Chargement de variables d'environnement depuis fichier .env  
**Installation :** `npm i dotenv`

---

## Queue & Background Jobs

### Bullmq
**Description :** Système de queue basé sur Redis pour Node.js  
**Installation :** `npm i @nestjs/bullmq bullmq`


---

## Scheduling (Cron Jobs)

### @nestjs/schedule
**Description :** Module de planification de tâches pour NestJS  
**Installation :** `npm i @nestjs/schedule`

---

## Email

### Nodemailer
**Version :** `^6.9.0`  
**Description :** Module pour envoyer des emails  
**Installation :** `npm i nodemailer`  
**Types :** `npm i -D @types/nodemailer`

---

## QR Code

### qrcode
**Version :** `^1.5.0`  
**Description :** Génération de QR codes  
**Installation :** `npm i qrcode`  
**Types :** `npm i -D @types/qrcode`

---

## Documentation API

### Swagger
**Description :** Documentation automatique de l'API  
**Installation :** `npm i @nestjs/swagger swagger-ui-express`

---

## Testing

### Jest
**Description :** Framework de test (inclus par défaut avec NestJS)  
**Installation :** Déjà inclus dans NestJS

---

## Logging

### Winston
**Description :** Logger flexible et extensible  
**Installation :** `npm i nest-winston winston`

---

## Utilitaires

### date-fns
**Version :** `^2.30.0`  
**Description :** Manipulation de dates  
**Installation :** `npm i date-fns`

### uuid
**Version :** `^9.0.0`  
**Description :** Génération d'identifiants uniques  
**Installation :** `npm i uuid`  
**Types :** `npm i -D @types/uuid`

---

## CORS & Security

### helmet
**Version :** `^7.0.0`  
**Description :** Sécurisation des headers HTTP  
**Installation :** `npm i helmet`

### @nestjs/throttler
**Description :** Rate limiting pour NestJS  
**Installation :** `npm i @nestjs/throttler`

---

## DevTools

### TypeScript
**Version :** `^5.0.0`  
**Description :** Langage de programmation  
**Installation :** Déjà inclus dans NestJS

### ts-node
**Description :** Exécution TypeScript  
**Installation :** Déjà inclus dans NestJS

### ESLint
**Description :** Linter pour JavaScript/TypeScript  
**Installation :** Déjà inclus dans NestJS

### Prettier
**Description :** Formateur de code  
**Installation :** Déjà inclus dans NestJS

---


## Structure de Projet Recommandée
```
src/
├── app.module.ts
├── main.ts
├── config/
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── email.config.ts
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── filters/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── parking-spots/
│   ├── reservations/
│   ├── checkin/
│   ├── dashboard/
│   ├── email-queue/
│   └── history/
└── database/
    ├── entities/
    ├── migrations/
    └── seeds/
```

## Container 
Docker