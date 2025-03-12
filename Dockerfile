FROM node:18-alpine

# Création du répertoire de travail
WORKDIR /usr/src/app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers de l'application
COPY . .

# Exposition du port utilisé par l'application
EXPOSE 5000

# Commande de démarrage de l'application
CMD ["node", "index.js"] 