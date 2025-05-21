# Générateur de Profils Aléatoires

Ce service est une partie de l'API qui génère des profils utilisateurs fictifs complets en combinant des données issues de plusieurs sources différentes.

## Sources de données

Le service utilise plusieurs APIs pour générer des profils complets:

1. **Randomuser.me** - Pour les informations de base de l'utilisateur
2. **Randommer.io** - Pour les informations financières et complémentaires
3. **Quotable.io** - Pour des citations aléatoires
4. **JokeAPI** - Pour des blagues aléatoires sur la programmation

## Configuration

### Prérequis

Pour utiliser ce service, vous devez obtenir une clé API pour Randommer.io:
1. Inscrivez-vous sur [Randommer.io](https://randommer.io/)
2. Obtenez votre clé API dans votre compte utilisateur

### Variables d'environnement

Ajoutez la clé API Randommer.io dans votre fichier `.env`:

```
RANDOMMER_API_KEY=votre_cle_api_randommer_io
```

## Utilisation

### Endpoint

```
GET /api/profile/generate
```

Cette route génère un profil utilisateur complet.

### Format de réponse

```json
{
  "user": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "gender": "male",
    "location": "Paris, France",
    "picture": "https://randomuser.me/api/portraits/men/1.jpg"
  },
  "phone_number": "+33 6 12 34 56 78",
  "iban": "FR1420041010050500013M02606",
  "credit_card": {
    "card_number": "4111111111111111",
    "card_type": "VISA",
    "expiration_date": "12/2026",
    "cvv": "123"
  },
  "random_name": "Alice",
  "pet": "Cat",
  "quote": {
    "content": "The only way to do great work is to love what you do.",
    "author": "Steve Jobs"
  },
  "joke": {
    "type": "Programming",
    "content": "Why do programmers prefer dark mode? Because light attracts bugs."
  }
}
```

## Implémentation

Le service est structuré comme suit:

- `src/services/profileGeneratorService.mjs` - Service qui gère les appels aux différentes APIs
- `src/controllers/profileGeneratorController.mjs` - Contrôleur qui expose l'endpoint
- `src/routes/profileGeneratorRoutes.mjs` - Routes pour accéder au service

## Limitations

- Le service dépend de la disponibilité des APIs externes
- Randommer.io a des limites de requêtes selon votre abonnement
- Des valeurs par défaut sont fournies en cas d'échec d'un appel API 