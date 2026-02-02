ADR 2 : Stratégie de persistance et modèle de données

Contexte
Le système doit gérer des réservations par créneaux, maintenir un historique complet, et assurer des contraintes strictes (ex: une place ne peut pas être louée deux fois sur le même créneau).

Décision
Utilisation d'une Base de données relationnelle (PostgreSQL).

Justifications
Intégrité : Les contraintes d'unicité et les transactions SQL garantissent qu'on ne puisse pas sur-réserver une place (Race Condition).

Historisation : Les capacités de requêtage SQL (JOIN, GROUP BY) sont idéales pour les dashboards des managers (taux d'occupation, statistiques).

Structure : Le plan du parking est fixe et bien défini (60 places, 6 rangées), ce qui se prête parfaitement à un schéma relationnel.

Conséquences
Positif : Robustesse des données et facilité de reporting.

Négatif : Nécessite une gestion rigoureuse des migrations de schéma au fil des itérations.