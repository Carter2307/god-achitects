ADR 1 : Choix de la plateforme utilisateur

Contexte
Le système doit être accessible à trois types de profils (Employés, Secrétaires, Managers) avec des contextes d'usage variés :

Les employés sur le terrain (parking) pour scanner un QR Code.

Le personnel administratif sur poste fixe pour la gestion.

Décision
Nous avons choisi de développer une Application Web Responsive (Mobile-First).

Justifications
Accessibilité : Aucune installation requise sur les téléphones personnels des employés (BYOD).

Interopérabilité : Fonctionne aussi bien sur les navigateurs desktop des secrétaires que sur les smartphones des employés.

QR Code : Les navigateurs modernes gèrent parfaitement l'ouverture d'URL via scan QR.

Conséquences
Positif : Déploiement unique, cycle de mise à jour rapide.

Négatif : Nécessite une connexion internet stable dans le parking (4G/5G ou WiFi d'entreprise).