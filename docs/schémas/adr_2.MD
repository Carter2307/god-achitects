# ADR 2 : Stratégie de persistance et conteneurisation des données

**Date :** 2026-02-03  
**Statut :** Accepté

---

## Contexte
Le système doit gérer des réservations par créneaux, maintenir un historique complet et assurer des contraintes strictes.  
De plus, l'environnement de développement doit être identique pour tous les membres de l'équipe et facilement déployable via des scripts.

---

## Décision
Utilisation d'une base de données relationnelle **PostgreSQL**, opérée exclusivement via un **conteneur Docker**.

---

## Justifications

### Intégrité
Les contraintes d'unicité et les transactions SQL garantissent qu'on ne puisse pas sur-réserver une place, évitant ainsi les conflits d'accès simultanés.

### Dockerisation
- L'utilisation de l'image officielle `postgres:alpine` garantit que chaque développeur travaille sur la même version du moteur de base de données.
- L'initialisation du schéma (DDL) peut être automatisée via le dossier `/docker-entrypoint-initdb.d/`.
- Cela simplifie le script `run.sh` : un seul `docker-compose up` suffit à monter l'application et sa persistance.

### Flexibilité des données
Le plan du parking (60 places, 6 rangées) est fixe et hiérarchique, ce qui est idéal pour un schéma relationnel.

---

## Conséquences

### Positif
Setup de développement **« zéro installation »** (à part Docker).  
Robustesse des données et facilité de reporting pour les managers.

### Négatif
Nécessite de bien gérer la persistance des volumes Docker sur l'hôte afin de ne pas perdre les données lors d'un `docker-compose down`.
