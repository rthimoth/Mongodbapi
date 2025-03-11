# API MongoDB avec Mongoose

Une API RESTful utilisant Express.js et MongoDB avec Mongoose pour gérer des profils utilisateurs.

## Prérequis

- Node.js et npm
- Docker et Docker Compose

## Installation

1. Cloner le dépôt
2. Installer les dépendances :
```
npm install express mongoose dotenv cors
npm install --save-dev nodemon
```

## Configuration

1. Créer un fichier `.env` avec les variables d'environnement suivantes :
```
MONGO_URI=mongodb://root:example@localhost:27017/api-mongoose?authSource=admin
PORT=5000
```

## Démarrage de la base de données

Démarrer le conteneur MongoDB :
```
docker-compose up -d
```

Se connecter à MongoDB (si nécessaire) :
```
docker exec -it mongo_container mongosh -u root -p example
```

## Lancement de l'application

En mode développement :
```
npm run dev
```

En mode production :
```
npm start
```

## Routes API

### Profils
- `GET /api/profiles` - Récupérer tous les profils
- `GET /api/profiles/:id` - Récupérer un profil par ID
- `POST /api/profiles` - Créer un nouveau profil
- `PUT /api/profiles/:id` - Mettre à jour un profil par ID
- `DELETE /api/profiles/:id` - Supprimer un profil par ID (soft-delete)

### Expériences
- `POST /api/profiles/:id/experience` - Ajouter une expérience à un profil
- `DELETE /api/profiles/:id/experience/:exp` - Supprimer une expérience d'un profil

### Compétences
- `POST /api/profiles/:id/skills` - Ajouter une compétence à un profil
- `DELETE /api/profiles/:id/skills/:skill` - Supprimer une compétence d'un profil

### Informations
- `PUT /api/profiles/:id/information` - Mettre à jour les informations d'un profil


perso:
put information 
{
  "bio": "Développeur passionné par les technologies web",
  "localisation": "Paris, France",
  "siteWeb": "https://example.com"
}

http://localhost:5000/api/profiles/67d01a6c15503afdba155a20/information


post skills / delete 
http://localhost:5000/api/profiles/67d01a6c15503afdba155a20/skills

post expérience  / DELETE 
http://localhost:5000/api/profiles/67d01a6c15503afdba155a20/experience

id client
http://localhost:5000/api/profiles/67d01a6c15503afdba155a20

get et post et delete
http://localhost:5000/api/profiles/

