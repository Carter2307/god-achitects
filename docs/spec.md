# Système de reservation de parking

## Contraintes et règles de réservation

- **Une réservation peut être effectuée pour un maximum de 5 jours ouvrables** (je ne peux pas réserver une place pour tout le mois) et peut commencer le jour même s'il y a des places disponibles.
- Si quelqu'un a besoin de recharger son véhicule, il doit demander une place dans les rangées **A ou F équipées de prises électriques.**
- **Un employé doit s'enregistrer lorsqu'il gare** sa voiture afin de confirmer que la place a été prise comme prévu.
- **Un code QR indiquant le numéro de la place et renvoyant vers un point final dédié** dans votre application sera imprimé sur chaque parking.
- Si une place réservée ne reçoit pas de confirmation d'enregistrement avant 11 heures, elle est marquée comme disponible et peut être réservée par quelqu'un d'autre le même jour.
- Les employés doivent pouvoir effectuer leurs réservations de manière totalement **autonome** à l'aide de cette application, mais **les secrétaires resteront chargés de l'assistance** et auront besoin d'un **accès administrateur complet au back-office de votre application afin de pouvoir modifier manuellement** tout ce qui est nécessaire.
- Votre application doit non seulement afficher les **réservations actuelles et futures**, mais également **conserver l'historique complet des réservations.**
- Outre le **profil Employé** (ce qu'un employé voit lorsqu'il ouvre l'application) et **le profil Secrétaire** (qui permet de tout voir et de tout modifier, y compris d'ajouter de nouveaux utilisateurs et de les gérer), il devrait également y avoir un **profil Gestionnaire** : les gestionnaires ont besoin **d'un tableau de bord pour savoir combien de personnes utilisent le parking, quel est son taux d'occupation moyen, quelle est la proportion de personnes qui font une réservation sans l'utiliser et quelle est la proportion de places équipées de chargeurs électriques.**
- **Les responsables** peuvent également réserver leur place de stationnement via l'application, mais ils sont autorisés à réserver la place pour **une durée d'un mois complet (30 jours)**.
- Lorsqu'une personne effectue une réservation, **un message doit être envoyé à une file d'attente afin d'être traité par une autre application** qui enverra un e-mail de confirmation.