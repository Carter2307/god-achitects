Le frontend se fera en react, typescript, react router  v8, tantStack query, axios (un client api existe déjà dans le projet pour directement faire appel au endpoint de l'api), tailwind v4, heroUi v3, secure-ls pour encrypté les donnée du localstorage/session storage, date-fns,  zod, react-hook-form, tanstack query,

Structure:
La gestion de l'authentification via un contexte d'authentification
Layout structuré
Les composants génériques doivent être isolé.
Aucune logique dans les pages. La logique d'une page doit être écris dans des hooks.
Les services doivent être centralisé.
Composition des composants pour former une page
Une page 404

Design:
UI minimalisme
Police: Geist
Couleur: primaire -> 18181B (button, text,...)
theme: White
Bordure Arrondie
taille des textes body: 13px
taille des titres: 18px

Réseau:
Utilisation du package clients disponible dans le projet pour les requêttes api.


Produit un document qui reprend ses éléments