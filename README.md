# GN_Dechet — Plateforme de pré-collecte des déchets en Guinée

## Structure du projet

```
GN_dechet/
├── backend/     ← Java Spring Boot (API REST)
├── frontend/    ← React Native / Expo (Application Mobile)
├── database/    ← Scripts SQL PostgreSQL
└── docs/        ← Documentation
```

## Démarrage rapide du backend

### Prérequis
- Java 17+
- Maven 3.8+
- PostgreSQL 14+

### 1. Créer la base de données
```sql
CREATE DATABASE gn_dechet_db;
```

### 2. Exécuter le script SQL
```bash
psql -U postgres -d gn_dechet_db -f database/schema.sql
```

### 3. Lancer le backend (profil développement)
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

L'API sera disponible sur : `http://localhost:8080`

## Endpoints principaux

| Méthode | URL | Description | Auth |
|---------|-----|-------------|------|
| POST | `/api/auth/inscription` | Créer un compte | ❌ Public |
| POST | `/api/auth/connexion` | Se connecter (→ token JWT) | ❌ Public |
| POST | `/api/menages/{id}/abonnements` | Payer un abonnement | ✅ JWT |
| GET  | `/api/menages/{id}/abonnements/actif` | Voir abonnement actif | ✅ JWT |
| POST | `/api/ramassages` | Demander un ramassage | ✅ JWT |
| POST | `/api/ramassages/{id}/accepter/{collecteurId}` | Accepter un ramassage | ✅ JWT |
| PATCH | `/api/ramassages/{id}/statut` | Mettre à jour le statut | ✅ JWT |
| GET  | `/api/ramassages/en-attente?quartier=Kaloum` | Demandes disponibles | ✅ JWT |

## Sécurité
- Authentification par **JWT Bearer Token**
- Mots de passe hashés avec **BCrypt**
- Profils `dev` / `prod` séparés
- Variables d'environnement pour les données sensibles en production
