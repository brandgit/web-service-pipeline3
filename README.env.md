# Configuration des Variables d'Environnement

Ce projet utilise des variables d'environnement pour configurer l'application. Ces variables sont chargées à partir d'un fichier `.env` situé à la racine du projet.

## Variables Disponibles

Voici les variables d'environnement que vous pouvez configurer :

### Variables Générales

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `NODE_ENV` | Environnement d'exécution (`development` ou `production`) | `development` |
| `PORT` | Port général du serveur | `3000` |
| `MONGODB_URI` | URL de connexion MongoDB générale | `mongodb://localhost:27017/api` |

### Variables de Développement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `DEV_PORT` | Port du serveur en développement | Valeur de `PORT` |
| `DEV_MONGODB_URI` | URL de connexion MongoDB en développement | Valeur de `MONGODB_URI` |

### Variables de Production

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `PROD_PORT` | Port du serveur en production | Valeur de `PORT` |
| `PROD_MONGODB_URI` | URL de connexion MongoDB en production | Valeur de `MONGODB_URI` |

## Création du Fichier .env

1. Copiez le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```

2. Modifiez les valeurs selon votre environnement

## Sécurité

Le fichier `.env` est exclu du contrôle de version dans `.gitignore`. Ne partagez jamais votre fichier `.env` contenant des informations sensibles. 