ADR 3 : Architecture asynchrone pour les notifications

Contexte
Chaque réservation doit déclencher un e-mail de confirmation via une application tierce.

Décision
Mise en œuvre d'un Message Broker (Redis ou RabbitMQ) pour un traitement asynchrone via une file de messages (Queue).

Justifications
Résilience : Si le service d'e-mail est indisponible, les messages restent dans la file et seront traités plus tard. La réservation reste valide.

Performance : L'utilisateur reçoit sa confirmation d'écran instantanément sans attendre la réponse du serveur SMTP.

Conséquences
Positif : Système plus fluide et tolérant aux pannes.

Négatif : Ajoute un composant d'infrastructure supplémentaire à monitorer dans le docker-compose.