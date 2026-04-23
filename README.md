# Plateforme RH intelligente (PFE)

Application Next.js fullstack pour l'automatisation du recrutement:

- gestion candidats / entreprises
- matching automatique CV ↔ offres
- decision automatique
- messagerie interne
- planification des entretiens
- generation de contrats PDF

## Stack

- Next.js App Router + TypeScript
- Firebase (Firestore/Auth/Storage)
- Zod validation
- TailwindCSS + Framer Motion

## Setup

1. Copier `.env.example` vers `.env.local`.
2. Completer les variables Firebase.
3. Installer les dependances:

```bash
npm install
```

4. Lancer en local:

```bash
npm run dev
```

## Endpoints API

- `POST /api/matching` -> calcul score CV/offre
- `POST /api/decisions` -> top N accepted, reste rejected
- `POST /api/messages` -> envoi message interne
- `POST /api/interviews/confirm` -> confirmation creneau entretien
- `POST /api/contracts` -> generation contrat PDF + notification interne
- `GET /api/feed` -> feed temps reel (snapshot)
- `GET /api/jobs?page=1&pageSize=10&q=front` -> recherche + pagination offres
- `GET /api/candidates?page=1&pageSize=10&q=react` -> recherche + pagination candidats

## Firebase Rules

Le fichier `firestore.rules` contient une base de regles de securite a adapter selon vos roles IAM/claims.
