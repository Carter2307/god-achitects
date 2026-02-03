# ADR 3 : Architecture asynchrone pour les notifications

## Contexte
Chaque réservation effectuée dans le système doit déclencher l'envoi d'un e-mail de confirmation via une application ou un service tiers.

Cependant, l'envoi d'e-mails peut être lent ou indisponible (serveur SMTP surchargé, panne du fournisseur, problème réseau). Il est donc risqué de bloquer la validation d’une réservation sur cette opération.

---

## Décision
Mise en œuvre d’un **Message Broker** (Redis ou RabbitMQ) afin de traiter l’envoi d’e-mails de manière **asynchrone** via une **file de messages (queue)**.

Le flux devient :

1. L’utilisateur effectue une réservation.
2. La réservation est enregistrée immédiatement.
3. Un message d’envoi d’e-mail est placé dans la file.
4. Un service consommateur traite la file et envoie l’e-mail.

---

## Justifications

### Résilience
Si le service d’envoi d’e-mails est indisponible, les messages restent en attente dans la file et seront traités ultérieurement.  
La réservation reste valide même si la notification est retardée.

### Performance
La réponse utilisateur est instantanée : il n’attend pas la réponse du serveur SMTP, souvent lente.

### Découplage des services
Le système de réservation n’est plus dépendant directement du service d’e-mail.  
Chaque composant peut évoluer indépendamment.

### Scalabilité
En cas d’augmentation de charge, il est possible d’ajouter plusieurs consommateurs pour traiter la file plus rapidement.

### Tolérance aux pics de charge
Si de nombreuses réservations sont faites simultanément, la file absorbe la charge et évite la saturation du système principal.

---

## Conséquences

### Positif
- Application plus fluide et réactive.
- Tolérance aux pannes des services externes.
- Possibilité d’absorber des pics de trafic.
- Architecture évolutive vers d’autres usages asynchrones (notifications SMS, logs, statistiques, etc.).

### Négatif
- Ajoute un composant d’infrastructure supplémentaire à maintenir et monitorer dans `docker-compose`.
- Complexité accrue pour le debugging (traitement différé).
- Nécessite une gestion des erreurs et mécanismes de retry côté consommateur.
