# ADR 1 : Choix de la plateforme utilisateur

## Contexte
Le système doit être accessible à trois types de profils (Employés, Secrétaires, Managers) avec des contextes d'usage variés :

- Les employés sur le terrain (parking) pour scanner un QR Code et gérer leur réservation.
- Le personnel administratif sur poste fixe pour effectuer des opérations de gestion et de suivi.

La solution doit donc fonctionner aussi bien sur mobile que sur desktop, sans complexifier le déploiement ni la maintenance.

---

## Décision
Nous avons choisi de développer une **application Web Responsive**, conçue selon une approche **Mobile-First**.

---

## Justifications

### Accessibilité
Aucune installation n’est requise sur les téléphones personnels des employés (BYOD — Bring Your Own Device).  
L’application est directement accessible via un navigateur.

### Interopérabilité
La même application fonctionne :
- sur les navigateurs desktop utilisés par les secrétaires et managers,
- sur les smartphones des employés sur le parking.

Un seul code source couvre tous les usages.

### Compatibilité QR Code
Les navigateurs modernes ouvrent directement les URL issues d’un scan de QR Code, rendant l’expérience utilisateur simple et rapide sans application dédiée.

### Maintenance simplifiée
Une seule application à maintenir et mettre à jour, sans dépendance aux stores mobiles ni aux cycles de validation d’applications natives.

---

## Conséquences

### Positif
- Déploiement unique pour tous les utilisateurs.
- Mises à jour instantanément disponibles.
- Coûts de développement et maintenance réduits.
- Compatibilité multi-plateforme immédiate.

### Négatif
- Dépendance à la qualité de la connexion réseau sur le parking.
- L’expérience utilisateur peut être légèrement inférieure à celle d’une application native dans certains cas spécifiques.
