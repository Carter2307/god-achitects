# Entités — Système de Réservation de Parking

---

## 1. User (Utilisateur)

Entité centrale du système. Chaque utilisateur possède un rôle qui détermine ses permissions et ses limites de réservation.

| Attribut | Type | Description |
|---|---|---|
| id | UUID | Identifiant unique |
| nom | String | Nom de l'utilisateur |
| prénom | String | Prénom de l'utilisateur |
| email | String | Email professionnel (unique) |
| mot_de_passe | String | Mot de passe hashé |
| rôle | Enum | `EMPLOYE`, `GESTIONNAIRE`, `SECRETAIRE` |
| statut | Enum | `ACTIF`, `INACTIF` |
| date_creation | DateTime | Date de création du compte |
| date_modification | DateTime | Dernière modification du profil |

**Règles métier :**
- Un `EMPLOYE` peut réserver jusqu'à **5 jours ouvrables**.
- Un `GESTIONNAIRE` peut réserver jusqu'à **30 jours**.
- Un `SECRETAIRE` a un accès administrateur complet (création, modification, suppression de tout).

---

## 2. ParkingSpot (Place de Parking)

Représente une place physique dans le parking.

| Attribut | Type | Description |
|---|---|---|
| id | UUID | Identifiant unique |
| numero | String | Numéro de la place (ex : A1, F3) |
| rangee | String | Lettre de la rangée (A à F, etc.) |
| a_chargeur_electrique | Boolean | `true` si la place est équipée d'une prise |
| statut | Enum | `DISPONIBLE`, `RESERVEE`, `OCCUPEE` |
| qr_code_url | String | URL du point de terminaison pour le check-in |
| date_creation | DateTime | Date d'ajout de la place au système |

**Règles métier :**
- Les rangées **A** et **F** sont équipées de prises électriques.
- Chaque place possède un **QR code** unique qui redirige vers l'endpoint de check-in.
- Le statut est mis à jour en temps réel selon les réservations et les enregistrements.

---

## 3. Reservation (Réservation)

Représente une réservation de place effectuée par un utilisateur.

| Attribut | Type | Description |
|---|---|---|
| id | UUID | Identifiant unique |
| user_id | UUID (FK) | Référence vers l'utilisateur |
| parking_spot_id | UUID (FK) | Référence vers la place réservée |
| date_debut | Date | Date de début de la réservation |
| date_fin | Date | Date de fin de la réservation |
| besoin_chargeur | Boolean | `true` si l'utilisateur a besoin d'un chargeur |
| statut | Enum | `EN_ATTENTE`, `CONFIRMEE`, `OCCUPEE`, `EXPIREE`, `ANNULEE` |
| date_creation | DateTime | Date de création de la réservation |
| date_modification | DateTime | Dernière mise à jour |

**Règles métier :**
- La durée max est de **5 jours ouvrables** pour un employé, **30 jours** pour un gestionnaire.
- Une réservation peut commencer **le jour même** si des places sont disponibles.
- Si `besoin_chargeur = true`, la place assignée doit être dans les rangées **A** ou **F**.
- Si aucun check-in n'est confirmé avant **11h00**, le statut passe automatiquement en `EXPIREE` et la place devient disponible.

---

## 4. CheckIn (Enregistrement)

Représente l'enregistrement d'un utilisateur lorsqu'il occupe sa place réservée.

| Attribut | Type | Description |
|---|---|---|
| id | UUID | Identifiant unique |
| reservation_id | UUID (FK) | Référence vers la réservation concernée |
| date_heure | DateTime | Date et heure de l'enregistrement |
| methode | Enum | `QR_CODE`, `MANUEL` |
| date_creation | DateTime | Date de création de l'enregistrement |

**Règles métier :**
- Un check-in est lié à **une seule réservation** (relation 1-à-1).
- Le check-in peut être effectué via le **scan du QR code** ou **manuellement** par un secrétaire.
- L'enregistrement doit se faire **avant 11h00** sinon la réservation est expirée automatiquement.

---

## 5. ReservationHistory (Historique des Réservations)

Conserve toutes les actions effectuées sur une réservation pour garantir une traçabilité complète.

| Attribut | Type | Description |
|---|---|---|
| id | UUID | Identifiant unique |
| reservation_id | UUID (FK) | Référence vers la réservation concernée |
| user_id | UUID (FK) | Utilisateur ayant effectué l'action |
| action | Enum | `CREATION`, `MODIFICATION`, `ANNULATION`, `CHECK_IN`, `EXPIRATION` |
| ancienne_valeur | JSON | État de la réservation avant l'action |
| nouvelle_valeur | JSON | État de la réservation après l'action |
| date_heure | DateTime | Date et heure de l'action |

**Règles métier :**
- Chaque modification, annulation ou changement de statut est automatiquement enregistrée.
- L'historique est **en lecture seule** : aucune suppression ni modification n'est possible.
- Accessible par les **secrétaires** et les **gestionnaires**.

---

## 6. QueueMessage (Message de File d'Attente)

Représente un message envoyé dans la file d'attente pour déclencher l'envoi d'un email par une application externe.

| Attribut | Type | Description |
|---|---|---|
| id | UUID | Identifiant unique |
| reservation_id | UUID (FK) | Réservation liée au message |
| type_message | Enum | `CONFIRMATION`, `ANNULATION`, `RAPPEL`, `EXPIRATION` |
| statut | Enum | `EN_ATTENTE`, `TRAITE`, `ECHEC` |
| nombre_tentatives | Integer | Nombre de tentatives d'envoi |
| date_creation | DateTime | Date de création du message |
| date_traitement | DateTime | Date de traitement du message |

**Règles métier :**
- Un message est envoyé à la file d'attente **dès qu'une réservation est créée, modifiée, annulée ou expirée**.
- Le message est consommé par un **worker externe** qui envoie l'email via un fournisseur de messagerie.
- En cas d'échec, le système réessaie avec un nombre de tentatives limité.

---

## 7. SystemConfig (Configuration Système)

Permet de gérer les paramètres globaux du système de façon dynamique.

| Attribut | Type | Valeur par défaut | Description |
|---|---|---|---|
| id | UUID | — | Identifiant unique |
| cle | String | — | Clé de configuration unique (ex : `HEURE_LIMITE_CHECKIN`) |
| valeur | String | — | Valeur associée |
| description | String | — | Description de la configuration |

**Exemples de configurations :**

| Clé | Valeur par défaut | Description |
|---|---|---|
| `HEURE_LIMITE_CHECKIN` | `11:00` | Heure limite pour confirmer un check-in |
| `JOURS_MAX_EMPLOYE` | `5` | Nombre max de jours ouvrables pour un employé |
| `JOURS_MAX_GESTIONNAIRE` | `30` | Nombre max de jours pour un gestionnaire |

---

## 8. DashboardMetrics (Métriques du Tableau de Bord)

Vue agrégée calculée en temps réel destinée aux gestionnaires. Cette entité n'est pas stockée directement en base de données ; elle est générée à partir des données des autres entités.

**Métriques calculées :**

| Métrique | Description |
|---|---|
| Taux d'occupation moyen | Pourcentage de places occupées sur une période donnée |
| Nombre d'utilisateurs actifs | Utilisateurs ayant au moins une réservation active |
| Taux de no-show | Proportion de réservations expirées sans check-in |
| Places avec chargeur électrique | Pourcentage de places équipées de prises sur le total |
| Réservations par jour/semaine/mois | Volume de réservations selon la période sélectionnée |

---

## Récapitulatif des Relations

| Entité source | Entité cible | Type de relation | Description |
|---|---|---|---|
| User | Reservation | 1 → N | Un utilisateur peut avoir plusieurs réservations |
| ParkingSpot | Reservation | 1 → N | Une place peut être réservée plusieurs fois (dans le temps) |
| Reservation | CheckIn | 1 → 0..1 | Une réservation a au plus un check-in |
| Reservation | ReservationHistory | 1 → N | Chaque action sur une réservation génère un historique |
| Reservation | QueueMessage | 1 → N | Plusieurs messages peuvent être envoyés pour une même réservation |
| User | CheckIn | — | Le check-in est lié indirectement via la réservation |